import path from "path";
import { expect } from "chai";
import { fileURLToPath } from "url";
import packageVersion from "../package.json";
import { Up2Pay } from "../src/up2pay.js";

//import payboxConfig from "../paybox-config.json";
import exp from "constants";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe("sandbox-form", async () => {
  const up2pay = Up2Pay.create({
    payboxSandbox: true,
    payboxSite: "1999888",
    payboxRang: "32",
    payboxIdentifiant: "1686319",
    payboxHmac:
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    payboxEffectue: "https://www.exemple.com/payment/success",
    payboxRefuse: "https://www.exemple.com/payment/error",
    payboxAnnule: "https://www.exemple.com/payment/cancelled",
    payboxAttente: "https://www.exemple.com/payment/waiting",
    payboxRepondreA: "https://www.exemple.com/payment/process",
    amount: 5000,
    email: "tester@example.com",
    reference: "123456",
  });

  it("form url", async() => {
    let form = await up2pay.form();
    expect(form.url).to.be.equal(
      "https://preprod-tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi"
    );
  });

  it("form method", async () => {
    let form = await up2pay.form();
    expect(form.method).to.be.equal("POST");
  });

  it("form form", async () => {
    let form = await up2pay.form();
    expect(form.form).to.be.any;
  });

  it("form elements", async () => {
    let form = await up2pay.form();
    expect(form.elements).to.be.any;
  });
});
