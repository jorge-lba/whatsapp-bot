import { NextApiRequest, NextApiResponse } from 'next'
import { message } from './controllers'

const methods = {
  POST: message
}

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method ?? ''
  try {
    //@ts-ignore
    await methods[method](_req, res)
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: `Method ${method} not is valid`})
  }
}

export default handler
