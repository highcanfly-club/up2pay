/*
 * Copyright© 2024 Ronan LE MEILLAT for SCTG Development,
 * Association High Can Fly and Les Ailes du Mont-Blanc
 *
 * Up2Pay is free software: you can redistribute it and/or modify
 * it under the terms of the Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Up2Pay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with Up2Pay. If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 */
import hmacSHA512 from "crypto-js/hmac-sha512.js";
import Hex from "crypto-js/enc-hex.js";

import errors from "./errors.js";
import type { Document, Params, Request, Result, FormElement, Billing, BaseUrls } from "./types";
import { isSignatureIsValid } from "./crypto.js";
import he from "he";
export * from "./types.js";

/**
 * Up2Pay class that implements the Document interface
 */
export class Up2Pay implements Document {
  /**
 * The request object containing the payment details
   */
  request: Request;

  /**
 * A boolean indicating whether to use the sandbox environment
   */
  sandbox: boolean;

  /**
 * The secret key as a hexadecimal string
   */
  secretKey: string;

  /**
 * The base URLs for the payment gateway
   */
  baseUrls: BaseUrls;

  /**
 * Constructor for the Up2Pay class
 * @param params The parameters for the payment request
   */
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

  /**
 * Creates a new instance of the Up2Pay class
 * @param params The parameters for the payment request
 * @returns A new instance of the Up2Pay class
   */
  static create(params: Params) {
    return new Up2Pay(params);
  }

  /**
 * Returns the error message for the given error code
 * @param code The error code
 * @returns The error message
   */
  static getError(code: string): string {
    if (code.startsWith("001")) {
      return "Paiement refusé par le centre d’autorisation";
    }

    if (code in errors) {
      return errors[code];
    }

    return `Erreur ${code}`;
  }

  /**
 * Returns the error message for the given error code
 * @param code The error code
 * @returns The error message
   */
  static isValid(result: Result, amount: number): boolean {
    return (
      !!result.authorizationId &&
      result.error === "00000" &&
      parseInt(result.amount, 10) === amount &&
      this.signatureIsValid(result)
    );
  }

  /**
 * Checks if the payment signature is valid
 * @param result The payment result
 * @returns true if the signature is valid, false otherwise
   */
  static signatureIsValid(result: Result): boolean {
    const signature = result.signature || "";
    delete result.signature;
    const message = new URLSearchParams(
      result as unknown as undefined
    ).toString();
    return isSignatureIsValid(message, signature, payboxPublicKey);
  }

  /**
 * Checks if the payment message is valid
 * @param message The payment message
 * @param base64sig The base64 encoded signature
 * @returns true if the message is valid, false otherwise
   */
  static messageIsValid(message: string, base64sig: string): boolean {
    return isSignatureIsValid(message, base64sig, payboxPublicKey);
  }

  /**
 * Returns the payment form elements
 * @returns A promise containing the payment form elements
   */
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

  /**
 * @deprecated
 * Returns the archivage value
 * @returns The archivage value
   */
  private archivage(): string {
    return Date.now().toString().substr(-12);
  }

  /**
 * Formats the payment amount
 * @param amount The payment amount
 * @returns The formatted amount
   */
  private formatAmount(amount: number | string): string {
    return `${parseInt(amount.toString(), 10)}`.padStart(10, "0");
  }

  /**
 * Sets the return variables
 * @returns The return variables as a string
   */
  private setReturnVars(): string {
    let vars = "";

    for (const key of Object.keys(returnVars)) {
      vars += `${returnVars[key]}:${key};`;
    }

    return vars;
  }

  /**
 * Returns the current time
 * @returns The current time as a string
   */
  private getTime() {
    const now = new Date();
    return now.toISOString();
  }

  /**
 * Returns the HMAC digest for the given message and secret key
 * @param message The message
 * @param secret The secret key
 * @returns The HMAC digest as a hexadecimal string
   */
  static getHMACDigest(message: string, secret: string): string {
    const hmac = Hex.parse(secret);
    return Hex.stringify(hmacSHA512(message, hmac)).toUpperCase();
  }

  /**
 * Computes the HMAC digest for the payment request
   */
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
 * Returns the payment URL
 * @returns A promise containing the payment URL
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

  /**
 * Returns the payment form elements
 * @returns An array of form elements
   */
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
 * Validates the payment response
 * @param url The payment response URL
 * @returns true if the response is valid, false otherwise
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
 * Returns the payment result
 * @param url The payment response URL
 * @returns The payment result
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

  /**
 * Returns the billing information as an XML string
 * @param billing The billing information
 * @returns The billing information as an XML string
   */
  public static getBilling(billing: Billing): string {
    return `<?xml version="1.0" encoding="utf-8" ?>
          <Billing>
            <Address>
              <FirstName>${billing.firstname}</FirstName>
              <LastName>${billing.lastname}</LastName>
              <Address1>${billing.address1}</Address1>
              ${billing.address2 ? `<Address2>${billing.address2}</Address2>` : ''}
              <ZipCode>${billing.zipcode}</ZipCode>
              <City>${billing.city}</City>
              <CountryCode>${billing.countrycode}</CountryCode>
            </Address>
          </Billing>`;
  }

  /**
 * Returns the shopping cart information as an XML string
 * @param quantity The quantity of items in the cart
 * @returns The shopping cart information as an XML string
   */
  static getShoppingCart(quantity: string): string {
    let iQuantity = parseInt(quantity)
    if (Number.isNaN(iQuantity)) {
      iQuantity = 1
    }
    if (iQuantity > 99) {
      iQuantity = 99
    }
    let szRet = `<?xml version="1.0" encoding="utf-8" ?>
               <shoppingcart>
                 <total>
                   <totalQuantity>${iQuantity.toString()}</totalQuantity>
                 </total>
               </shoppingcart>`;
    //return he.encode(szRet, { useNamedReferences: true })
    return szRet;
  }

  /**
 * Populates the payment form with the payment elements
 * @param parentFormElement The parent form element
 * @param payboxFormElements The payment form elements
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

/**
 * The return paypox code variables
 * * M - Montant de la transaction (précisé dans PBX_TOTAL)
 * R - Référence commande (précisée dans PBX_CMD) : espace URL encodé
 * T - Numéro d’appel Up2Pay
 * A - numéro d’Autorisation (numéro remis par le centre d’autorisation) : URL encodé
 * B - numéro d’aBonnement (numéro remis par Up2Pay)
 * C - Type de Carte retenu (cf. PBX_TYPECARTE)
 * D - Date de fin de validité de la carte du porteur. Format : AAMM
 * E - Code réponse de la transaction
 * F - Etat de l’authentiFication du porteur vis-à-vis du programme 3-D Secure
 * G - Garantie du paiement par le programme 3-D Secure. Format : O ou N
 * H - Empreinte de la carte
 * I - Code pays de l’adresse IP de l’internaute. Format : ISO 3166 (alphabétique)
 * J - 2 derniers chiffres du numéro de carte du porteur
 * K - Signature sur les variables de l’URL. Format : url-encodé
 * N - 6 premiers chiffres (« biN6 ») du numéro de carte de l’acheteur
 * O - Enrôlement du porteur au programme 3-D Secure
 * o - Spécifique Cetelem : Option de paiement sélectionnée par le client :
 * P - Type de Paiement retenu (cf. PBX_TYPEPAIEMENT)
 * Q - Heure de traitement de la transaction. Format : HH:MM:SS (24h)
 * S - Numéro de TranSaction Up2Pay
 * U - Gestion des abonnements avec le traitement Up2Pay Direct Plus.
 * V - Nouvel identifiant de l’abonné sigmaplus.
 * W - Date de traitement de la transaction sur la plateforme Up2Pay. Format : JJMMAAAA
 * Y - Code paYs de la banque émettrice de la carte. Format : ISO 3166 (alphabétique)
 * Z - Index lors de l’utilisation des paiements mixtes (cartes cadeaux associées à un complément par carte CB/Visa/MasterCard/Amex)
 */
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

/**
 * The endpoint for the payment gateway
 */
const endpoint = "/cgi/FramepagepaiementRWD.cgi"; //old /cgi/MYchoix_pagepaiement.cgi

/**
 * The default base URLs for the payment gateway
 */
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

/**
 * The Paybox public key
 */
const payboxPublicKey =
  "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe+hkicNP7ROHUssGNtHwiT2Ew\nHFrSk/qwrcq8v5metRtTTFPE/nmzSkRnTs3GMpi57rBdxBBJW5W9cpNyGUh0jNXc\nVrOSClpD5Ri2hER/GcNrxVRP7RlWOqB1C03q4QYmwjHZ+zlM4OUhCCAtSWflB4wC\nKa1g88CjFwRw/PB9kwIDAQAB\n-----END PUBLIC KEY-----";
