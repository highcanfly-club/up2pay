import { Up2Pay } from './up2pay'
import axios from 'axios'
import {expect, jest, test,beforeEach} from '@jest/globals';

beforeEach(() => {
  jest.resetAllMocks()
})

test('should get an error from the provided code', () => {
  let error = Up2Pay.getError('00100')
  expect(error).toBe('Paiement refusé par le centre d’autorisation')

  error = Up2Pay.getError('00021')
  expect(error).toBe('Carte non autorisée')

  error = Up2Pay.getError('0123131')
  expect(error).toBe('Erreur 0123131')
})

test('compare HMAC',()=>{
  const up2pay = Up2Pay.create({
    payboxSandbox: true,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 5000,
    email: 'tester@example.com',
    reference: '123456',
  });
  //9BD7513F353BF6BD580F1E57603F29254D00AC9C80CCE21A89636606063F7F4F985E81AE27BA0312C3651A080CF0137806DFF24DBC1D0AC61716C5D3CFF2DEB0

  console.log(up2pay.request.PBX_HMAC)
})
test('should get the validity status of a payment result', () => {
  const signatureIsValid = jest.spyOn(Up2Pay, 'signatureIsValid').mockImplementation(() => true)

  let status = Up2Pay.isValid(<any>{}, 5000)
  expect(status).toBe(false)

  status = Up2Pay.isValid(<any>{ authorizationId: '1234', error: '00123' }, 5000)
  expect(status).toBe(false)

  status = Up2Pay.isValid(<any>{ authorizationId: '1234', error: '00000', amount: '1234' }, 5000)
  expect(status).toBe(false)

  status = Up2Pay.isValid(<any>{ authorizationId: '1234', error: '00000', amount: '5000' }, 5000)
  expect(status).toBe(true)
  expect(signatureIsValid).toHaveBeenCalledTimes(1)
})

test('should get a valid sandbox up2pay form', async () => {
  let get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>OK<' }))

  const up2pay = Up2Pay.create({
    payboxSandbox: true,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 5000,
    email: 'tester@example.com',
    reference: '123456',
  })

  let form = await up2pay.form()

  expect(get).toHaveBeenCalledTimes(1)
  expect(form.url).toBe('https://preprod-tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi')
  expect(form.method).toBe('POST')
  expect(form.form).toBeTruthy()
  expect(form.elements).toBeTruthy()

  get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>NOK<' }))

  form = await up2pay.form()

  expect(form.url).toBe('https://preprod-tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi')
})

test('should get a valid production up2pay form', async () => {
  let get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>OK<' }))

  const up2pay = Up2Pay.create({
    payboxSandbox: false,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 5000,
    email: 'tester@example.com',
    reference: '123456',
  })

  let form = await up2pay.form()

  expect(get).toHaveBeenCalledTimes(1)
  expect(form.url).toBe('https://tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi')
  expect(form.method).toBe('POST')
  expect(form.form).toBeTruthy()
  expect(form.elements).toBeTruthy()

  get = jest.spyOn(axios, 'get').mockImplementation(async () => ({ data: '>NOK<' }))

  form = await up2pay.form()

  expect(form.url).toBe('https://tpeweb.e-transactions.fr/cgi/FramepagepaiementRWD.cgi')
})

test('should create a up2pay payment', () => {
  const email = 'tester@example.com'

  const up2pay = Up2Pay.create({
    payboxSandbox: true,
    payboxSite: '1999888',
    payboxRang: '32',
    payboxIdentifiant: '1686319',
    payboxHmac: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    payboxEffectue: 'https://www.exemple.com/payment/success',
    payboxRefuse: 'https://www.exemple.com/payment/error',
    payboxAnnule: 'https://www.exemple.com/payment/cancelled',
    payboxAttente: 'https://www.exemple.com/payment/waiting',
    payboxRepondreA: 'https://www.exemple.com/payment/process',
    amount: 5000,
    email,
    reference: '123456',
  })

  expect(up2pay.sandbox).toBe(true)
  expect(up2pay.request.PBX_TOTAL).toBe('0000005000')
  expect(up2pay.request.PBX_DEVISE).toBe('978')
  expect(up2pay.request.PBX_PORTEUR).toBe(email)
  expect(up2pay.request.PBX_RUF1).toBe('POST')
  expect(up2pay.request.PBX_HASH).toBe('SHA512')
  expect(up2pay.request.PBX_EFFECTUE).toBe('https://www.exemple.com/payment/success')
  expect(up2pay.request.PBX_REFUSE).toBe('https://www.exemple.com/payment/error')
  expect(up2pay.request.PBX_ANNULE).toBe('https://www.exemple.com/payment/cancelled')
  expect(up2pay.request.PBX_ATTENTE).toBe('https://www.exemple.com/payment/waiting')
  expect(up2pay.request.PBX_REPONDRE_A).toBe('https://www.exemple.com/payment/process')
})
