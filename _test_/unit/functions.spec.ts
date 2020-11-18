import { config } from 'dotenv'

import {
  splitAndFormatMessage,
  testContentArray,
  testAnItemAgaintsVariousData,
  senderIsMentorOrParticipant,
  formatContactMessageText,
  formatMultContactsMessageText
}from '../../src/pages/api/whatsapp/functions'

import mentoringData from '../../src/utils/mentoring-data-test'

config({path: '.env.test.local'})

test('Deve dividir uma mensagem recebida em commando, complemento e texto', () => {
  const inputValue = 'mentoria#1 Estou esperando vocês para a mentoria.'
  const {command, complement, text} = splitAndFormatMessage(inputValue)
  
  expect(command).toEqual('mentoria')
  expect(complement).toEqual('1')
  expect(text).toEqual('Estou esperando vocês para a mentoria.')
})

test('Deve verificar se um valor de entrada se encontra em um lista, se sim retorna o mesmo', async () => {
  const list = ['mentoria', 'discord', 'duvida']
  const inputValue = 'mentoria'

  const result = await testContentArray<string>(list)(inputValue)

  expect(result).toEqual(inputValue)
})

test('Deve retornar um item em um array de objetos', () => {
  const list = mentoringData
  const item = 'id'
  const inputValue = 1

  const result = testAnItemAgaintsVariousData(list)(item)(inputValue)

  expect(result).toEqual(list[0])
})

test('Deve verificar se o input corresponde a um participante ou mentor', () => {
  const mentoring = mentoringData[0]
  const inputValue = `${process.env.WHATSAPP_PARTICIPANT}`
  const valueTo = `${process.env.WHATSAPP_MENTOR}`

  const [result] = senderIsMentorOrParticipant(inputValue)(mentoring)

  expect(result.to).toEqual(valueTo)
  expect(result.message).toEqual('Boa tarde, o time 1 está esperando seu contato para a mentoria.')
})

test('Deve formatar os dados de entrada e transformar em um objeto', () => {
  const inputTo = `${process.env.WHATSAPP_PARTICIPANT}`
  const inputFrom = `${process.env.ZENVIA_FROM}`
  const inputMessage = 'OK'

  const result = formatContactMessageText(inputFrom, inputTo, inputMessage)

  expect(result.from).toEqual(inputFrom)
  expect(result.to).toEqual(inputTo)
  expect(result.contents[0].text).toEqual(inputMessage)
})

test('Deve formatar vários dados de entrada e transformar em um objeto', () => {
  const mentoring = mentoringData[0]
  const inputValue = `${process.env.WHATSAPP_MENTOR}`
  const inputFrom = `${process.env.ZENVIA_FROM}`
  const valueTo = `${process.env.WHATSAPP_PARTICIPANT}`

  const list = senderIsMentorOrParticipant(inputValue)(mentoring)

  const result = formatMultContactsMessageText(inputFrom)(list)

  expect(result[0].from).toEqual(inputFrom)
  expect(result[0].to).toEqual(valueTo)
  expect(result[0].contents[0].text).toEqual('O mentor(a) Jane está esperando o seu time para a mentoria.')
})
