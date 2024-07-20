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
    firstname: 'Ronan',
    lastname: 'L.',
    address1: '18 route de Notre-Dame-de-la-Gorge',
    zipcode: '74170',
    city: 'Les Contamines-Montjoie',
    countrycode: "250", // Code ISO-3166-1
    reference: "123456",
    totalquantity: '12'
  });

  it("form url", async() => {
    let form = await up2pay.form();
    expect(form.url).to.be.equal(
      "https://recette-tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi"
    );
  });

  it("form method", async () => {
    let form = await up2pay.form();
    expect(form.method).to.be.equal("POST");
  });

  it("form form", async () => {
    let form = await up2pay.form();
    console.log(form.form);
    expect(form.form).to.be.string;
  });

  it("form elements", async () => {
    let form = await up2pay.form();
    expect(form.elements).to.be.any;
  });
});

describe("sandbox-form-override-baseurls", async () => {
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
    firstname: 'Ronan',
    lastname: 'L.',
    address1: '18 route de Notre-Dame-de-la-Gorge',
    zipcode: '74170',
    city: 'Les Contamines-Montjoie',
    countrycode: "250", // Code ISO-3166-1
    reference: "123456",
    totalquantity: '12',
    baseUrls: {
      prod: {
        main: "https://tpeweb.e-transactions.fr",
        fallback: "https://tpeweb.e-transactions.fr",
      },
      sandbox: {
        main: "https://preprod-tpeweb.e-transactions.fr",
        fallback: "https://preprod-tpeweb.e-transactions.fr",
      },
      }
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
    console.log(form.form);
    expect(form.form).to.be.string;
  });

  it("form elements", async () => {
    let form = await up2pay.form();
    expect(form.elements).to.be.any;
  });
});
