# up2pay System

This library is a simple implementation of the up2pay System payment solution

## How to use it

- Install the library
- And then import it in your script

### Get the payment form button

```js
import { Up2Pay } from "@sctg/up2pay"

const payment = Up2Pay.create({
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: 'HMACHMACHMAC',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 4990, // This is the price x100 to remove the comma
    email: 'adrian@example.com',
    reference: '123456',
});

const form = await payment.form();
```

Where `form` contains an object similar to the one below.

```
{
  "url": "https://preprod-tpeweb.up2pay.com/cgi/MYchoix_pagepaiement.cgi",
  "method": "POST",
  "form": "<input type=\"hidden\" name=\"PBX_SITE\" value=\"1999888\" /><input type=\"hidden\" name=\"PBX_RANG\" value=\"32\" /><input type=\"hidden\" name=\"PBX_IDENTIFIANT\" value=\"1686319\" /><input type=\"hidden\" name=\"PBX_ARCHIVAGE\" value=\"559891246771\" /><input type=\"hidden\" name=\"PBX_TOTAL\" value=\"0000004990\" /><input type=\"hidden\" name=\"PBX_DEVISE\" value=\"978\" /><input type=\"hidden\" name=\"PBX_CMD\" value=\"123456\" /><input type=\"hidden\" name=\"PBX_PORTEUR\" value=\"adrian@example.com\" /><input type=\"hidden\" name=\"PBX_RETOUR\" value=\"amount:M;paymentId:R;transactionId:T;authorizationId:A;cardType:P;cardNumber:N;cardExpiration:D;error:E;payboxRef:S;signature:K;\" /><input type=\"hidden\" name=\"PBX_RUF1\" value=\"POST\" /><input type=\"hidden\" name=\"PBX_3DS\" value=\"N\" /><input type=\"hidden\" name=\"PBX_TIME\" value=\"07062019090726\" /><input type=\"hidden\" name=\"PBX_HASH\" value=\"SHA512\" /><input type=\"hidden\" name=\"PBX_EFFECTUE\" value=\"https://www.arlettie.fr/payment/success\" /><input type=\"hidden\" name=\"PBX_REFUSE\" value=\"https://www.arlettie.fr/payment/error\" /><input type=\"hidden\" name=\"PBX_ANNULE\" value=\"https://www.arlettie.fr/payment/cancelled\" /><input type=\"hidden\" name=\"PBX_ATTENTE\" value=\"https://www.arlettie.fr/payment/waiting\" /><input type=\"hidden\" name=\"PBX_REPONDRE_A\" value=\"https://api.arlettie.fr/payments/webhook\" /><input type=\"hidden\" name=\"PBX_HMAC\" value=\"713E1F0FF270D5AA16A61B76C3BACCC4A15B039E6472B0D13EE51D905D3DFA196FC572600646B5897ACDFBDE1404EE7BAFF727D1EDB723C0DA121720D485E7F7\" />",
  "elements": [
    {
      "name": "PBX_SITE",
      "value": "1999888"
    },

    [...]

    {
      "name": "PBX_HMAC",
      "value": "713E1F0FF270D5AA16A61B76C3BACCC4A15B039E6472B0D13EE51D905D3DFA196FC572600646B5897ACDFBDE1404EE7BAFF727D1EDB723C0DA121720D485E7F7"
    }
  ]
}
```

Note: It is better to use the `form` string instead of the `elements` array because the values are computed in a given order. This way you are certain that there will be no problem.

### Check the returned transaction

Always use the `payboxRepondreA` to check the transaction. This is a url directly called by Up2Pay from server to server that returns the result of the transaction.

```
const { Up2Pay } = require('@adriantombu/up2pay-system')

// This is an exemple of a POST body that you retrieve from the Up2Pay call
const body = {
  authorizationId: '1234',
  error: '00000',
  amount: '4990',
  signature: 'SQDGFQSDGFQSDFR234GGR23523423',
  paymentId: '123456'
}

 // This should be saved in your database (along with the transaction id) before the user goes to the Up2Pay form
const amount = 4990;

const status = Up2Pay.isValid(body, amount)
// true
```

## How to contribute

- Clone the repository `git clone git@github.com:adriantombu/up2pay-system.git`
- Install the packages with `yarn install`
- Modify the files under in the `src/` folder
- When everything's done, you can send a PR \o/
