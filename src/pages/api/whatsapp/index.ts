import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosInstance } from 'axios'

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method

  if(method === 'POST') await message(_req, res)
}

const ZENVIA_SANDBOX_TOKEN = `${process.env.ZENVIA_SANDBOX_TOKEN}`
const ZENVIA_WHATSAPP_URL = `${process.env.ZENVIA_WHATSAPP_URL}`

 
interface BodySengingText {
  from: string,
  to: string,
  contents: [
    {
      type: string,
      text: string
    }
  ]
}

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

async function message(_req: NextApiRequest, res: NextApiResponse){
  try {

    const contact:BodySengingText = {
      from: _req.body.message.to,
      to: _req.body.message.from,
      contents:[{ 
        type: 'text',
        text: _req.body.message.text
      }, ]
    }

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
