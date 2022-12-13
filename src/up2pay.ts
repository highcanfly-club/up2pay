import hmacSHA512 from "crypto-js/hmac-sha512.js";
import Hex from "crypto-js/enc-hex.js";

import errors from "./errors.js";
import type { Document, Params, Request, Result, FormElement } from "./types";
import { isSignatureIsValid } from "./crypto.js";

export * from "./types.js";

export class Up2Pay implements Document {
  request: Request;
  sandbox: boolean;

  constructor(params: Params) {
    this.sandbox = params.payboxSandbox;

    this.request = {
      PBX_SITE: params.payboxSite,
      PBX_RANG: params.payboxRang,
      PBX_IDENTIFIANT: params.payboxIdentifiant,
      PBX_ARCHIVAGE: this.archivage(),
      PBX_HMAC: params.payboxHmac,

      PBX_TOTAL: this.formatAmount(params.amount),
      PBX_DEVISE: "978",

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
    const signature = result.signature || ""
    delete result.signature;
    const message = new URLSearchParams(
      result as unknown as undefined
    ).toString();
      return isSignatureIsValid(message,signature,payboxPublicKey)
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
    const day = now.getDay().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");

    return `${day}${month}${year}${hour}${minute}${second}`;
  }

  private getHMACDigest(message: string, secret: string): string {
    const hmac = Hex.parse(secret);
    return Hex.stringify(hmacSHA512(message, hmac)).toUpperCase();
  }

  private async computeHMAC() {
    if (this.request.PBX_HMAC) {
      const elements = this.getFormElements();
      const key = this.request.PBX_HMAC;
      const chain = elements
        .filter((e) => e.name !== "PBX_HMAC")
        .map((e) => `${e.name}=${e.value}`)
        .join("&");

      const digest = this.getHMACDigest(chain, key);
      this.request.PBX_HMAC = digest;
    }
  }

  /**
   * check if remote tpeweb is working
   * @returns a Promise<string> containg the url of the tpeweb endpoint
   */
  private getUrl(): Promise<string> {
    const urls = this.sandbox ? baseUrls.sandbox : baseUrls.prod;
    const rUrl = `${urls.main}/load.html`;
    return new Promise<string>((resolve) => {
      fetch(rUrl).then((value) => {
        value.text().then((data)=>{
          resolve(
            `${
              data.includes(">OK<") ? urls.main : urls.fallback
            }/cgi/MYchoix_pagepaiement.cgi` //new CA=FramepagepaiementRWD.cgi
          );
        })
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
}

const returnVars = <{ [index: string]: string }>{
  M: "amount",
  R: "paymentId",
  T: "transactionId",
  A: "authorizationId",
  P: "cardType",
  N: "cardNumber",
  D: "cardExpiration",
  E: "error",
  S: "payboxRef",
  K: "signature",
};

const baseUrls = {
  prod: {
    main: "https://tpeweb.e-transactions.fr",
    fallback: "https://tpeweb.e-transactions.fr",
  },
  sandbox: {
    main: "https://preprod-tpeweb.e-transactions.fr",
    fallback: "https://preprod-tpeweb.e-transactions.fr",
  },
};

const payboxPublicKey =
  "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe+hkicNP7ROHUssGNtHwiT2Ew\nHFrSk/qwrcq8v5metRtTTFPE/nmzSkRnTs3GMpi57rBdxBBJW5W9cpNyGUh0jNXc\nVrOSClpD5Ri2hER/GcNrxVRP7RlWOqB1C03q4QYmwjHZ+zlM4OUhCCAtSWflB4wC\nKa1g88CjFwRw/PB9kwIDAQAB\n-----END PUBLIC KEY-----";
