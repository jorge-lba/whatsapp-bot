import axios, { AxiosInstance } from 'axios'

import mentoringData from '../../../utils/mentoring-data'
import { Mentoring } from '../../../interfaces'

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

type Method = "get" | "GET" | 
  "delete" | "DELETE" | 
  "head" | "HEAD" | 
  "options" | "OPTIONS" | 
  "post" | "POST" | 
  "put" | "PUT" | 
  "patch" | "PATCH" | 
  "purge" | "PURGE" | 
  "link" | "LINK" | 
  "unlink" | "UNLINK" | undefined


const splitAndFormatMessage = (message: string) => {
  const [fullCommand, text] = message.trim().split(' ')
  const [command, complement] = fullCommand.split('#')

  return {
    command,
    complement,
    text
  }
}

const sendingMessage =(request: AxiosInstance) => 
  async (contact:BodySengingText) => await request({data: JSON.stringify(contact)})

const setAxiosConfig = (baseURL:string) => 
  (contentType:string) => 
  (token:string) => 
  (method:Method) => axios.create({
    baseURL, 
    headers: {
      'content-type': contentType,
      'X-API-TOKEN': token
    },
    method: method
  })

export async function mentoringIsValid(id:number){
  const mentoring = await mentoringData[0]
  if(mentoring.id === id){
    return mentoring
  }
  throw 'Mentoria inválida'
}

export function testContentArray<T>(array:T[]) {
  return async function(value:T): Promise <T> {
    const result = array.find((element) => element === value)
    if(result){
      return result 
    }
    throw 'Commando inválido'
  }
}

export function senderIsMentorOrParticipant(from:string){
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

export function formatContactMessageText(from: string, to: string, message: string): BodySengingText{
  return {
    from,
    to,
    contents:[{ 
      type: 'text',
      text: message
    }, ]
  }
}

type MessageAndTo = {message: string, to: string}

const formatMultContactsMessageText = (from: string) => 
  (contacts:MessageAndTo[]) => contacts.map(({message, to})=> formatContactMessageText(from, to, message))

export {
  splitAndFormatMessage,
  setAxiosConfig,
  sendingMessage,
  formatMultContactsMessageText
}