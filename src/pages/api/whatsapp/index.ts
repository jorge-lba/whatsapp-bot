import { NextApiRequest, NextApiResponse } from 'next'
import {
  splitAndFormatMessage,
  sendingMessage,
  senderIsMentorOrParticipant,
  formatContactMessageText,
  testContentArray,
  setAxiosConfig,
  formatMultContactsMessageText,
  testAnItemAgaintsVariousData
}from './functions'

import mentoringData from '../../../utils/mentoring-data' // Esse item é um mock para simular uma resposta do banco de dados

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method

  if(method === 'POST') await message(_req, res)
}

async function message(_req: NextApiRequest, res: NextApiResponse){
  try {
    const {from:to, to:from} = _req.body.message
    const message = 'Enviamos um aviso para os interessados.'

    const {
      command,
      complement
    } = splitAndFormatMessage(_req.body.message.contents[0].text)

    await testCommandIsValid(command)
      .then(() => getMentoringIdIs(complement))
      .then(senderIsMentorOrParticipant(to))
      .then(formatMultContactsMessageText(from))
      .then(sendingMultMessageWhatsappZenvia)
      .then(() => formatContactMessageText(from, to, message ))
      .then(sendingMessageWhatsappZenvia)
      .catch(async(err) => {
        const contact = formatContactMessageText(from, to, err)
        await sendingMessageWhatsappZenvia(contact)
      })

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

const testCommandIsValid = testContentArray<string>(commandList)
const sendingMessageWhatsappZenvia = sendingMessage(provider)
const sendingMultMessageWhatsappZenvia = (contacts:any) => contacts.map(sendingMessageWhatsappZenvia)
const getMentoringIdIs = testAnItemAgaintsVariousData(mentoringData)('id')

export default handler
