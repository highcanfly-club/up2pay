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
import path from 'path';
import {expect} from "chai";
import {fileURLToPath} from 'url';
import packageVersion from "../package.json"
import { Up2Pay } from "../src/up2pay.js";

//import payboxConfig from "../paybox-config.json";
import exp from 'constants';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe('template', () => {
    it('TEST', () => {
         expect(6).to.be.equal(6);
     });
})
