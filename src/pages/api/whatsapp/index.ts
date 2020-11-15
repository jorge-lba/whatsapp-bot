import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosInstance } from 'axios'

import mentoringData from '../../../utils/mentoring-data'
import { Mentoring } from '../../../interfaces'

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method

  if(method === 'POST') await message(_req, res)
}

async function message(_req: NextApiRequest, res: NextApiResponse){
  try {
    const ZENVIA_SANDBOX_TOKEN = `${process.env.ZENVIA_SANDBOX_TOKEN}`
    const ZENVIA_WHATSAPP_URL = `${process.env.ZENVIA_WHATSAPP_URL}`

    const provider = configureProvider(ZENVIA_SANDBOX_TOKEN, ZENVIA_WHATSAPP_URL)

    const from = _req.body.message.to
    const to = _req.body.message.from

    console.log(from, to)

    const message = _req.body.message.contents[0].text.trim().split(' ')
    const [command, complement]:[string, string] = message[0].split('#')

    await testCommandIsValid(command)
      .then(() => mentoringIsValid(parseInt(complement)))
      .then(mentoring => senderIsMentorOrParticipant(to)(mentoring))
      .then(whatsappNumbers => whatsappNumbers.map( ({to, message}) => formatContactMessageText(from, to, message)))
      .then(contacts => contacts.map(sendingMessage(provider)))
      .then(() => formatContactMessageText(from, to, 'Enviamos um aviso para os interessados.'))
      .then(sendingMessage(provider))
      .catch(err => {
        sendingMessage(provider)(formatContactMessageText(from, to, err))
      })

    res.status(200).json({
      message: 'Sua mensagem foi enviada'
    })  
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
  
}
 
type BodySengingText = {
  from: string,
  to: string,
  contents: [
    {
      type: string,
      text: string
    }
  ]
}

const commandList = [
  'mentoria'
]

function configureProvider(token:string, baseURL:string){
  return axios.create({
    baseURL, 
    headers: {
      'content-type': 'application/json',
      'X-API-TOKEN': token
    },
  })
}

function sendingMessage(request: AxiosInstance){
    return async function (contact:BodySengingText){
      console.log(contact)
      await request({
        method: 'POST',
        data: JSON.stringify(contact)
      })
    }
}

async function mentoringIsValid(id:number){
  const mentoring = await mentoringData[0]
  if(mentoring.id === id){
    return mentoring
  }
  throw 'Mentoria inválida'
}

function testContentArray<T>(array:T[]) {
  return async function(value:T): Promise <T> {
    const result = array.find((element) => element === value)
    if(result){
      return result 
    }
    throw 'Commando inválido'
  }
}

function senderIsMentorOrParticipant(from:string){
  return function(mentoring:Mentoring){
    if(mentoring.mentor.whatsapp === from){
      return mentoring.team.participants.map(participant => ({
        to:participant.whatsapp,
        message: `O mentor(a) ${mentoring.mentor.name} está esperando o seu time para a mentoria.`
      }))
    }
    
    const participant = mentoring.team.participants.find(participant => participant.whatsapp === from)
    if(participant){
      return [{
        to: mentoring.mentor.whatsapp,
        message: `Boa tarde, o time ${mentoring.team.id} está esperando seu contato para a mentoria.`  
      }]
    }

    throw 'Você não faz parte dessa mentoria, verifique o ID da sua mentoria'
  }
}

function formatContactMessageText(from: string, to: string, message: string): BodySengingText{
  return {
    from,
    to,
    contents:[{ 
      type: 'text',
      text: message
    }, ]
  }
}

const testCommandIsValid = testContentArray<string>(commandList)

export default handler
