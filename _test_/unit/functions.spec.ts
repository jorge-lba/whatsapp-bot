import { config } from 'dotenv'

import {
  splitAndFormatMessage,
  testContentArray,
  testAnItemAgaintsVariousData,
  senderIsMentorOrParticipant,
  // formatContactMessageText,
  // formatMultContactsMessageText,
}from '../../src/pages/api/whatsapp/functions'

import mentoringData from '../../src/utils/mentoring-data-test'

config({path: '.env.local'})

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

  const [result] = senderIsMentorOrParticipant(inputValue)(mentoring)

  expect(result.to).toEqual(inputValue)
  expect(result.message).toEqual('O mentor(a) Jane está esperando o seu time para a mentoria.')
})
