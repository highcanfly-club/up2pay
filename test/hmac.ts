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

describe('hmac', () => {
    it('hmac', () => {
        const message = "PBX_SITE=1753161&PBX_RANG=01&PBX_IDENTIFIANT=720212226&PBX_TOTAL=0000000001&PBX_DEVISE=978&PBX_CMD=test&PBX_PORTEUR=ronan@lesailesdumontblanc.cf&PBX_RETOUR=amount:M;paymentId:R;transactionId:T;authorizationId:A;cardType:P;cardNumber:N;cardExpiration:D;error:E;payboxRef:S;signature:K;&PBX_RUF1=POST&PBX_TIME=2022-12-13T14:37:08.447Z&PBX_HASH=SHA512&PBX_EFFECTUE=https://localhost:8788/up2pay/success&PBX_REFUSE=https://localhost:8788/up2pay/error&PBX_ANNULE=https://localhost:8788/up2pay/cancelled&PBX_ATTENTE=https://localhost:8788/up2pay/waiting&PBX_REPONDRE_A=https://localhost:8788/up2pay/process"
        const secret = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
        const _r =  Up2Pay.getHMACDigest(message,secret)
        expect(_r).to.be.equal("6E5105BB8585E4412C68F1E9E018F4227103CB64E9F1DBB22537CA17D300DC67BA053D1DFFFA8942DCB05B3DD91258EEBB420EE5781BD75618705F24C4C94507");
     });
})
