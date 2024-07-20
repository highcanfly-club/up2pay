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
import { Params } from "../src/types.js";

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
    const payboxConfig = {
      "payboxSandbox": true,
      "payboxSite": "1999888",
      "payboxRang": "32",
      "payboxIdentifiant": "1686319",
      "payboxHmac":
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "payboxEffectue": "https://www.exemple.com/payment/success",
      "payboxRefuse": "https://www.exemple.com/payment/error",
      "payboxAnnule": "https://www.exemple.com/payment/cancelled",
      "payboxAttente": "https://www.exemple.com/payment/waiting",
      "payboxRepondreA": "https://www.exemple.com/payment/process",
    }
    const email = "tester@example.com";
    const config: Params = {
      ...payboxConfig,
      amount: 1,
      email: email,
      firstname: 'Ronan',
      lastname: 'L.',
      address1: '18 route de Notre-Dame-de-la-Gorge',
      zipcode: '74170',
      city: 'Les Contamines-Montjoie',
      totalquantity: '12',
      countrycode: "250", // Code ISO-3166-1
      reference: "123456",
    };
    const up2pay = Up2Pay.create(config);
    const form = await up2pay.form();
  });
});
