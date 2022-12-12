import path from "path";
import { expect } from "chai";
import { fileURLToPath } from "url";
import packageVersion from "../package.json";
import { Up2Pay } from "../src/up2pay.js";

//import payboxConfig from "../paybox-config.json";
import exp from "constants";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe("error codes", () => {
  it("00100", () => {
    let error = Up2Pay.getError("00100");
    expect(error).to.be.equal("Paiement refusé par le centre d’autorisation");
  });
  it("00021", () => {
    let error = Up2Pay.getError("00021");
    expect(error).to.be.equal("Carte non autorisée");
  });

  it("0123131", () => {
    let error = Up2Pay.getError("0123131");
    expect(error).to.be.equal("Erreur 0123131");
  });
});
