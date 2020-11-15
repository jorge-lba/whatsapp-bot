import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosInstance } from 'axios'

import mentoringData from '../../../utils/mentoring-data'
import mentoring from '../../../utils/mentoring-data'

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method

  if(method === 'POST') await message(_req, res)
}

const ZENVIA_SANDBOX_TOKEN = `${process.env.ZENVIA_SANDBOX_TOKEN}`
const ZENVIA_WHATSAPP_URL = `${process.env.ZENVIA_WHATSAPP_URL}`

 
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

async function configureProvider(token:string, baseURL:string){
  return await axios.create({
    baseURL, 
    headers: {
      'content-type': 'application/json',
      'X-API-TOKEN': token
    },
  })
}

async function sendingMessage(request: AxiosInstance,contact:BodySengingText){
    return await request({
      method: 'POST',
      data: JSON.stringify(contact)
    })
}

async function mentoringIsValid(id:number){
  const mentoring = await mentoringData[0]
  console.log(mentoring.id, id)
  return mentoring.id === id ? true : false
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

const testCommandIsValid = testContentArray<string>(commandList)

// console.log(testCommandIsValid('mentorias'))

async function message(_req: NextApiRequest, res: NextApiResponse){
  try {

    const contact:BodySengingText = {
      from: _req.body.message.to,
      to: _req.body.message.from,
      contents:[{ 
        type: 'text',
        text: _req.body.message.contents[0].text
      }, ]
    }

    const message = _req.body.message.contents[0].text.trim().split(' ')
    const [command, complement]:[string, string] = message[0].split('#')

    const test = await testCommandIsValid(command)
      .then(() => mentoringIsValid(parseInt(complement)))
      .then(console.log)
      .catch(err => console.log(err))

    const requestResult = await configureProvider(ZENVIA_SANDBOX_TOKEN, ZENVIA_WHATSAPP_URL)
      .then(provider => sendingMessage(provider, contact))

    console.log(requestResult.data)

    res.status(200).json({
      message: 'Sua mensagem foi enviada'
    })  
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
  
}

export default handler
