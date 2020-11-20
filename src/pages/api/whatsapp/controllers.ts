import { NextApiRequest, NextApiResponse } from 'next'
import {
  splitAndFormatMessage,
  sendingMessage,
  senderIsMentorOrParticipant,
  formatContactMessageText,
  testContentArray,
  setAxiosConfig,
  formatMultContactsMessageText,
  testAnItemAgaintsVariousData,
  compose,
}from './functions'

import mentoringData from '../../../utils/mentoring-data' // Esse item é um mock para simular uma resposta do banco de dados

async function message(_req: NextApiRequest, res: NextApiResponse){
  try {
    const {from:to, to:from} = _req.body.message
    const message = 'Enviamos um aviso para os interessados.'

    try {
      const recipients = await compose(
        splitAndFormatMessage,
        testCommandIsValid,
        getMentoringIdIs,
        senderIsMentorOrParticipant(to),
        formatMultContactsMessageText(from),
        sendingMultMessageWhatsappZenvia
      )(_req.body.message.contents[0].text)
      console.log(recipients)

      const sender = await compose(
        formatContactMessageText,
        sendingMessageWhatsappZenvia
      )({from, to, message} )
      console.log(sender)

    } catch (error) {
      const sender = await compose(
        formatContactMessageText,
        sendingMessageWhatsappZenvia
      )({from, to, message:error} )

      console.log(sender)
    }

    res.status(200).json({status: 200, message: 'Ok'})  
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}

const commandList = [
  'mentoria'
]

const ZENVIA_SANDBOX_TOKEN = `${process.env.ZENVIA_SANDBOX_TOKEN}`
const ZENVIA_WHATSAPP_URL = `${process.env.ZENVIA_WHATSAPP_URL}`

const provider = setAxiosConfig
  (ZENVIA_WHATSAPP_URL)
  ('application/json')
  (ZENVIA_SANDBOX_TOKEN)
  ('POST')

const testCommandIsValid = async (requestItens: {command: string, complement:string, text:string}) => {
  await testContentArray<string>(commandList)(requestItens.command.toLowerCase())
  return +requestItens.complement
}

const sendingMessageWhatsappZenvia = sendingMessage(provider)

const sendingMultMessageWhatsappZenvia = async (contacts:any) => {
  const result = []
  for(const contact of contacts){
    const response = await sendingMessageWhatsappZenvia(contact)
    result.push(response)
  }
  return result
}
const getMentoringIdIs = testAnItemAgaintsVariousData(mentoringData)('id')

export {
  message
}