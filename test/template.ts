import path from 'path';
import {expect} from "chai";
import {fileURLToPath} from 'url';
import packageVersion from "../package.json"
import { Up2Pay } from "../src/up2pay.js";

import payboxConfig from "../paybox-config.json";
import exp from 'constants';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe('template', () => {
    it('TEST', () => {
         expect(6).to.be.equal(6);
     });
})
