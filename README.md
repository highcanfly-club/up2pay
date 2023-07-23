# up2pay System

This library is a simple implementation of the up2pay System payment solution with 3DSecure v2

## How to use it

- Install the library
- And then import it in your script

### Get the payment form button

```js
import { Up2Pay } from "@highcanfly-club/up2pay"

const payment = Up2Pay.create({
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 4990, // This is the price x100 to remove the comma
    email: 'ronan@example.com',
    firstname: 'Ronan',
    lastname: 'L.',
    address1: '18 route de Notre-Dame-de-la-Gorge',
    zipcode: '74170',
    city: 'Les Contamines-Montjoie',
    countrycode: "250", // Code ISO-3166-1
    totalquantity: "12"
    reference: '123456',
});

const form = await payment.form();
```

Where `form` contains an object similar to the one below.

```
{
  "url": "https://preprod-tpeweb.up2pay.com/cgi/MYchoix_pagepaiement.cgi",
  "method": "POST",
  "form": "<input type="hidden" name="PBX_SITE" value="1999888" /><input type="hidden" name="PBX_RANG" value="32" /><input type="hidden" name="PBX_IDENTIFIANT" value="1686319" /><input type="hidden" name="PBX_TOTAL" value="0000005000" /><input type="hidden" name="PBX_DEVISE" value="978" /><input type="hidden" name="PBX_SOURCE" value="RWD" /><input type="hidden" name="PBX_CMD" value="123456" /><input type="hidden" name="PBX_PORTEUR" value="tester@example.com" /><input type="hidden" name="PBX_RETOUR" value="amount:M;paymentId:R;transactionId:T;authorizationId:A;cardType:C;cardNumber:N;cardExpiration:D;error:E;payboxRef:S;date:W;time:Q;signature:K;" /><input type="hidden" name="PBX_RUF1" value="POST" /><input type="hidden" name="PBX_TIME" value="2023-07-23T15:05:26.181Z" /><input type="hidden" name="PBX_HASH" value="SHA512" /><input type="hidden" name="PBX_EFFECTUE" value="https://www.exemple.com/payment/success" /><input type="hidden" name="PBX_REFUSE" value="https://www.exemple.com/payment/error" /><input type="hidden" name="PBX_ANNULE" value="https://www.exemple.com/payment/cancelled" /><input type="hidden" name="PBX_ATTENTE" value="https://www.exemple.com/payment/waiting" /><input type="hidden" name="PBX_REPONDRE_A" value="https://www.exemple.com/payment/process" /><input type="hidden" name="PBX_BILLING" value="<?xml version="1.0" encoding="utf-8" ?><Billing><Address><FirstName>Ronan</FirstName><LastName>L.</LastName><Address1>18 route de Notre-Dame-de-la-Gorge</Address1><ZipCode>74170</ZipCode><City>Les Contamines-Montjoie</City><CountryCode>250</CountryCode></Address></Billing>" /><input type="hidden" name="PBX_SHOPPINGCART" value="<?xml version="1.0" encoding="utf-8" ?><shoppingcart><total><totalQuantity>12</totalQuantity></total></shoppingcart>" /><input type="hidden" name="PBX_HMAC" value="BAF2413F96EBA244D9E59EF50BD6F8A3A974AE441D3A88A0280EC949E17F4B261A8DDC5438898181AB009369EC3C6E1825377D44D31991CDD47C71339BC8D1AB" />",
  "elements": [
    {
      "name": "PBX_SITE",
      "value": "1999888"
    },

    [...]

    {
      "name": "PBX_HMAC",
      "value": "9AACAEC2F642D1A1A1210E1074A08A290AEB838E58A73C0B9CD41CE02F68EE58CC559989E3701EC168AADB5144915C504C0657D3475CD3808B2F521FFC028344"
    }
  ]
}
```
if needed you can provide a optional parameter with baseUrls, default is:
```js
baseUrls: {
  prod: {
    main: "https://tpeweb.e-transactions.fr",
    fallback: "https://tpeweb.e-transactions.fr",
  },
  sandbox: {
    main: "https://recette-tpeweb.e-transactions.fr",
    fallback: "https://recette-tpeweb.e-transactions.fr",
  },
}
```
example:
```js
import { Up2Pay } from "@highcanfly-club/up2pay"

const payment = Up2Pay.create({
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 4990, // This is the price x100 to remove the comma
    email: 'ronan@example.com',
    firstname: 'Ronan',
    lastname: 'L.',
    address1: '18 route de Notre-Dame-de-la-Gorge',
    zipcode: '74170',
    city: 'Les Contamines-Montjoie',
    countrycode: "250", // Code ISO-3166-1
    totalquantity: "12"
    reference: '123456',
    baseUrls: {
              prod: {
                main: "https://tpeweb.e-transactions.fr",
                fallback: "https://tpeweb.e-transactions.fr",
              },
              sandbox: {
                main: "https://preprod-tpeweb.e-transactions.fr",
                fallback: "https://preprod-tpeweb.e-transactions.fr",
              },
              });

const form = await payment.form();
```
Note: It is better to use the `form` string instead of the `elements` array because the values are computed in a given order. This way you are certain that there will be no problem.

If you want to populate dynamically with `form.elements` a form you can use `Up2Pay.populateForm(parentForm,form.elements)` 

### Check the returned transaction

Always use the `payboxRepondreA` to check the transaction. This is a url directly called by Up2Pay from server to server that returns the result of the transaction.

```
const { Up2Pay } = require('@highcanfly-club/up2pay')

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

