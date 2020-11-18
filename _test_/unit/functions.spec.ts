import {
  splitAndFormatMessage,
  testContentArray,
  // senderIsMentorOrParticipant,
  // formatContactMessageText,
  // formatMultContactsMessageText,
  // testAnItemAgaintsVariousData
}from '../../src/pages/api/whatsapp/functions'

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