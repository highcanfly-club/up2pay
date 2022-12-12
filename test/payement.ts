import path from "path";
import { expect } from "chai";
import { fileURLToPath } from "url";
import packageVersion from "../package.json";
import { Up2Pay } from "../src/up2pay.js";

//import payboxConfig from "../paybox-config.json" assert { type: "json" };
import exp from "constants";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe("should get the validity status of a payment result", () => {
  it("invalid 5000", () => {
    let status = Up2Pay.isValid(<any>{}, 5000);
    expect(status).to.be.false;
  });
  it("invalid 1234", () => {
    let status = Up2Pay.isValid(
      <any>{ authorizationId: "1234", error: "00123" },
      5000
    );
    expect(status).to.be.false;
  });
  it("invalid amount=1234", () => {
    let status = Up2Pay.isValid(
      <any>{ authorizationId: "1234", error: "00000", amount: "1234" },
      5000
    );
    expect(status).to.be.false;
  });

  it("invalid amount=5000", () => {
    let status = Up2Pay.isValid(
      <any>{ authorizationId: "1234", error: "00000", amount: "5000" },
      5000
    );
    expect(status).to.be.false;
  });
});

describe("sandbox payement", () => {
  it("should create a up2pay payment", async () => {
    const payboxConfig= {
        "payboxSandbox":true,
        "payboxSite": "1999888",
        "payboxRang": "32",
        "payboxIdentifiant": "1686319",
        "payboxHmac":
          "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "payboxEffectue": "https://www.exemple.com/payment/success",
        "payboxRefuse": "https://www.exemple.com/payment/error",
        "payboxAnnule": "https://www.exemple.com/payment/cancelled",
        "payboxAttente": "https://www.exemple.com/payment/waiting",
        "payboxRepondreA": "https://www.exemple.com/payment/process"
      }
    const email = "tester@example.com";
    const config = {
      ...payboxConfig,
      amount: 1,
      email: email,
      reference: "123456",
    };
    const up2pay = Up2Pay.create(config);
    const form = await up2pay.form();
    console.log(form.form)
  });
});
