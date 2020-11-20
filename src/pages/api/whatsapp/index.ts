import { NextApiRequest, NextApiResponse } from 'next'
import { methodsConfig }from './functions'
import { message } from './controllers'

async function handler (_req: NextApiRequest, res: NextApiResponse) {
  const method = _req.method ?? ''
  await selectMethod(_req, res)(method)
}

const methodNull = () => {throw 'Rota Invalida.'} 
const selectMethod = methodsConfig(methodNull, message, methodNull, methodNull)

export default handler
