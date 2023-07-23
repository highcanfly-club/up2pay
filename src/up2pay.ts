import hmacSHA512 from "crypto-js/hmac-sha512.js";
import Hex from "crypto-js/enc-hex.js";

import errors from "./errors.js";
import type { Document, Params, Request, Result, FormElement, Billing, BaseUrls } from "./types";
import { isSignatureIsValid } from "./crypto.js";
import he from "he";
export * from "./types.js";

export class Up2Pay implements Document {
  request: Request;
  sandbox: boolean;
  secretKey: string; //hexstring
  baseUrls: BaseUrls;

  constructor(params: Params) {
    this.sandbox = params.payboxSandbox;
    this.secretKey = params.payboxHmac || "";
    if (typeof params.baseUrls !== "undefined") {
      this.baseUrls = params.baseUrls;
    } else {
      this.baseUrls = baseUrlsDefault;
    }
    this.request = {
      PBX_SITE: params.payboxSite,
      PBX_RANG: params.payboxRang,
      PBX_IDENTIFIANT: params.payboxIdentifiant,
      //PBX_ARCHIVAGE: this.archivage(),

      PBX_TOTAL: this.formatAmount(params.amount),
      PBX_DEVISE: "978",
      PBX_SOURCE: "RWD",
      PBX_CMD: params.reference,
      PBX_PORTEUR: params.email,
      PBX_RETOUR: this.setReturnVars(),
      PBX_RUF1: "POST",

      PBX_TIME: this.getTime(),
      PBX_HASH: "SHA512",

      PBX_EFFECTUE: params.payboxEffectue,
      PBX_REFUSE: params.payboxRefuse,
      PBX_ANNULE: params.payboxAnnule,
      PBX_ATTENTE: params.payboxAttente,
      PBX_REPONDRE_A: params.payboxRepondreA,
      PBX_BILLING: Up2Pay.getBilling(
        {
          firstname: params.firstname,
          lastname: params.lastname,
          address1: params.address1,
          address2: params.address2,
          zipcode: params.zipcode,
          city: params.city,
          countrycode: params.countrycode
        }),
      PBX_SHOPPINGCART: Up2Pay.getShoppingCart(params.totalquantity),
      PBX_HMAC: "",
    };

    this.computeHMAC();
  }

  static create(params: Params) {
    return new Up2Pay(params);
  }

  static getError(code: string): string {
    if (code.startsWith("001")) {
      return "Paiement refusé par le centre d’autorisation";
    }

    if (code in errors) {
      return errors[code];
    }

    return `Erreur ${code}`;
  }

  static isValid(result: Result, amount: number): boolean {
    return (
      !!result.authorizationId &&
      result.error === "00000" &&
      parseInt(result.amount, 10) === amount &&
      this.signatureIsValid(result)
    );
  }

  static signatureIsValid(result: Result): boolean {
    const signature = result.signature || "";
    delete result.signature;
    const message = new URLSearchParams(
      result as unknown as undefined
    ).toString();
    return isSignatureIsValid(message, signature, payboxPublicKey);
  }
  /**
   *
   * @param message the url part of the PBX response without &signature=…
   * @param base64sig
   * @returns
   */
  static messageIsValid(message: string, base64sig: string): boolean {
    return isSignatureIsValid(message, base64sig, payboxPublicKey);
  }

  async form() {
    return {
      url: await this.getUrl(),
      method: this.request.PBX_RUF1,
      form: this.getFormElements()
        .map(
          (e) => `<input type="hidden" name="${e.name}" value="${e.value}" />`
        )
        .join(""),
      elements: this.getFormElements(),
    };
  }

  private archivage(): string {
    return Date.now().toString().substr(-12);
  }

  private formatAmount(amount: number | string): string {
    return `${parseInt(amount.toString(), 10)}`.padStart(10, "0");
  }

  private setReturnVars(): string {
    let vars = "";

    for (const key of Object.keys(returnVars)) {
      vars += `${returnVars[key]}:${key};`;
    }

    return vars;
  }

  private getTime() {
    const now = new Date();
    return now.toISOString();
  }

  /**
   *
   * @param message the Paybox concatentation of parameters
   * @param secret the hexstring of the secret key
   * @returns the hmacSHA512 digest in a uppercase string
   */
  static getHMACDigest(message: string, secret: string): string {
    const hmac = Hex.parse(secret);
    return Hex.stringify(hmacSHA512(message, hmac)).toUpperCase();
  }

  private async computeHMAC() {
    if (this.secretKey) {
      const elements = this.getFormElements();
      const key = this.secretKey;
      const chain = elements
        .filter((e) => e.name !== "PBX_HMAC")
        .map((e) => `${e.name}=${e.value}`)
        .join("&");

      const digest = Up2Pay.getHMACDigest(chain, key);
      this.request.PBX_HMAC = digest;
    }
  }

  /**
   * check if remote tpeweb is working
   * @returns a Promise<string> containg the url of the tpeweb endpoint
   */
  private getUrl(): Promise<string> {
    const urls = this.sandbox ? this.baseUrls.sandbox : this.baseUrls.prod;
    const rUrl = `${urls.main}/load.html`;
    return new Promise<string>((resolve) => {
      fetch(rUrl).then((value) => {
        value.text().then((data) => {
          resolve(
            `${data.includes(">OK<") ? urls.main : urls.fallback}${endpoint}` //new CA=FramepagepaiementRWD.cgi
          );
        });
      });
    });
  }

  private getFormElements() {
    const elements: FormElement[] = [];

    for (const key of Object.keys(this.request)) {
      elements.push({
        name: key,
        value: (this.request as any)[key],
      });
    }

    return elements;
  }

  /**
   *
   * @param url complete url with signature
   * @returns true if signature is valid false otherwise
   */
  static validateResponse(url: URL) {
    const search = url.search;
    const message = search.substring(1, search.lastIndexOf("&signature"));
    const searchParams = new URLSearchParams(url.search);
    const signature = searchParams.has("signature")
      ? decodeURI(searchParams.get("signature") as string)
      : "";
    return Up2Pay.messageIsValid(message, signature);
  }

  /**
   *
   * @param url complete url with signature
   * @returns a Result containing the parsed url
   */
  static getResult(url: URL): Result {
    const searchParams = new URLSearchParams(url.search);
    return {
      amount: searchParams.has("amount")
        ? (searchParams.get("amount") as string)
        : "",
      paymentId: searchParams.has("paymentId")
        ? (searchParams.get("paymentId") as string)
        : "",
      transactionId: searchParams.has("transactionId")
        ? (searchParams.get("transactionId") as string)
        : "",
      authorizationId: searchParams.has("authorizationId")
        ? (searchParams.get("authorizationId") as string)
        : "",
      cardType: searchParams.has("cardType")
        ? (searchParams.get("cardType") as string)
        : "",
      cardNumber: searchParams.has("cardNumber")
        ? (searchParams.get("cardNumber") as string)
        : "",
      cardExpiration: searchParams.has("cardExpiration")
        ? (searchParams.get("cardExpiration") as string)
        : "",
      error: searchParams.has("error")
        ? (searchParams.get("error") as string)
        : "",
      payboxRef: searchParams.has("payboxRef")
        ? (searchParams.get("payboxRef") as string)
        : "",
      date: searchParams.has("date")
        ? (searchParams.get("date") as string)
        : "",
      time: searchParams.has("time")
        ? (searchParams.get("time") as string)
        : "",
      signature: searchParams.has("signature")
        ? decodeURI(searchParams.get("signature") as string)
        : "",
    } as Result;
  }

  static getBilling(billing: Billing): string {
    let szRet = '<?xml version="1.0" encoding="utf-8" ?>'
    szRet += "<Billing>"
    szRet += "<Address>"
    szRet += `<FirstName>${billing.firstname}</FirstName>`
    szRet += `<LastName>${billing.lastname}</LastName>`
    szRet += `<Address1>${billing.address1}</Address1>`
    if (typeof billing.address2 != "undefined" && billing.address2.length > 0) {
      szRet += `<Address2>${billing.address2}</Address2>`
    }
    szRet += `<ZipCode>${billing.zipcode}</ZipCode>`
    szRet += `<City>${billing.city}</City>`
    szRet += `<CountryCode>${billing.countrycode}</CountryCode>`
    szRet += "</Address>"
    szRet += "</Billing>"
    //return he.encode(szRet, { useNamedReferences: true })
    return szRet
  }

  static getShoppingCart(quantity: string): string {
    let iQuantity = parseInt(quantity)
    if (Number.isNaN(iQuantity)) {
      iQuantity = 1
    }
    if (iQuantity > 99) {
      iQuantity = 99
    }
    let szRet = '<?xml version="1.0" encoding="utf-8" ?>'
    szRet += '<shoppingcart>'
    szRet += '<total>'
    szRet += `<totalQuantity>${iQuantity.toString()}</totalQuantity>`
    szRet += '</total>'
    szRet += '</shoppingcart>'
    //return he.encode(szRet, { useNamedReferences: true })
    return szRet
  }

  /**
   * 
   * @param parentFormElement the HTMLFormElement wich contains all the new inputs (must exist)
   * @param payboxFormElements the elements to adds (probably form.elements)
   */
  static populateForm(parentFormElement: HTMLFormElement, payboxFormElements: FormElement[]): void {
    payboxFormElements.map((e) => {
      const _inputElement: HTMLInputElement = document.createElement('input') as HTMLInputElement;
      _inputElement.type = "hidden";
      _inputElement.name = e.name;
      _inputElement.value = e.value;
      parentFormElement.appendChild(_inputElement)
    })
  }
}

const returnVars = <{ [index: string]: string }>{
  M: "amount",
  R: "paymentId",
  T: "transactionId",
  A: "authorizationId",
  C: "cardType",
  N: "cardNumber",
  D: "cardExpiration",
  E: "error",
  S: "payboxRef",
  W: "date",
  Q: "time",
  K: "signature",
};

const endpoint = "/cgi/FramepagepaiementRWD.cgi"; //old /cgi/MYchoix_pagepaiement.cgi
const baseUrlsDefault = {
  prod: {
    main: "https://tpeweb.e-transactions.fr",
    fallback: "https://tpeweb.e-transactions.fr",
  },
  sandbox: {
    main: "https://recette-tpeweb.e-transactions.fr",
    fallback: "https://recette-tpeweb.e-transactions.fr",
  },
};

const payboxPublicKey =
  "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe+hkicNP7ROHUssGNtHwiT2Ew\nHFrSk/qwrcq8v5metRtTTFPE/nmzSkRnTs3GMpi57rBdxBBJW5W9cpNyGUh0jNXc\nVrOSClpD5Ri2hER/GcNrxVRP7RlWOqB1C03q4QYmwjHZ+zlM4OUhCCAtSWflB4wC\nKa1g88CjFwRw/PB9kwIDAQAB\n-----END PUBLIC KEY-----";
