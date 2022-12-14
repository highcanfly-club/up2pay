import path from "path";
import { expect } from "chai";
import { fileURLToPath } from "url";
import packageVersion from "../package.json";
import { Up2Pay } from "../src/up2pay.js";
import fs from "fs";
import crypto from "node:crypto";
import { isSignatureIsValid as testSignature } from "../src/crypto.js";

//import payboxConfig from "../paybox-config.json";
import exp from "constants";
import { verify } from "crypto";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const payboxPublicKey = fs
  .readFileSync(`${__dirname}/../localhostpubkey.pem`)
  .toString("utf-8");
const message = fs.readFileSync(`${__dirname}/../data.txt`).toString("utf-8");
const sig64 = fs.readFileSync(`${__dirname}/../sig64.txt`).toString("utf-8");

function signatureIsValid(signature64: string): boolean {
  const signature = Buffer.from(signature64, "base64"); //new Buffer(signature64 || "", "base64");
  if (
    signature.length !== 128 &&
    signature.length !== 256 &&
    signature.length !== 512 &&
    signature.length !== 1024
  ) {
    return false;
  }

  const publicKey = crypto.createPublicKey(payboxPublicKey);

  return crypto
    .createVerify("SHA1")
    .update(message)
    .verify(publicKey, signature);
}

function signatureIsValidNew(signature64: string): boolean {
  return testSignature(message, signature64, payboxPublicKey);
}

describe("signature via mode", () => {
  it("signature node:crypto", () => {
    expect(signatureIsValid(sig64)).to.be.true;
  });
  it("signature node:crypto invalid", () => {
    expect(signatureIsValid("a" + sig64)).to.be.false;
  });
});

describe("signature via jsrsasign", () => {
  it("signature jsrsasign", async () => {
    const _r = signatureIsValidNew(sig64);
    expect(_r).to.be.true;
  });
  it("signature jsrsasign invalid", async () => {
    const _r = signatureIsValidNew("aA0" + sig64);
    expect(_r).to.be.false;
  });
});

describe("validate response", () => {
  it("valid response", () => {
    const url = new URL(
      "https://localhost:8788/up2pay/_cancelled?amount=900&paymentId=Paiement%20pour%20ronan@lesailesdumontblanc.cf%2014/12/2022%2013:13:45&transactionId=71622616&cardType=3DSECURE&cardNumber=&error=00001&payboxRef=0&signature=HxPfoUEfCY%2BPeji87VMoym50i9lNKsWj20oU3QiRQLiiqJaKlEMtJnltn4xfJWHjwUVFLC%2FBFLMdoNBnmEYjck5nJbIJdvtfzBzlFODHVZXfEVf94xrFsA4PGaTqT8VPmJSJx2eoi93LztSV7ihXJL5fYA6RXFLo4KwNUQvYwAI%3D"
    );
    expect(Up2Pay.validateResponse(url)).to.be.true;
  });
  it("invalid response", () => {
    const url = new URL(
      "https://localhost:8788/up2pay/_cancelled?amount=1000&paymentId=Paiement%20pour%20ronan@lesailesdumontblanc.cf%2014/12/2022%2013:13:45&transactionId=71622616&cardType=3DSECURE&cardNumber=&error=00001&payboxRef=0&signature=HxPfoUEfCY%2BPeji87VMoym50i9lNKsWj20oU3QiRQLiiqJaKlEMtJnltn4xfJWHjwUVFLC%2FBFLMdoNBnmEYjck5nJbIJdvtfzBzlFODHVZXfEVf94xrFsA4PGaTqT8VPmJSJx2eoi93LztSV7ihXJL5fYA6RXFLo4KwNUQvYwAI%3D"
    );
    expect(Up2Pay.validateResponse(url)).to.be.false;
  });
});
