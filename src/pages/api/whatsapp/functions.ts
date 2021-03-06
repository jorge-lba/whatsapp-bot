import axios, { AxiosInstance } from 'axios'
import { Mentoring, BodySendingText, Method, MessageAndTo } from '../../../interfaces'

const compose = (...funcs: Function[]) => async (value: any) =>{
  let result = value
  for(const func of funcs){
    result = await func(result)
  }
  return result
}

const toLowerCase = (text: string) => text.toLowerCase()

const splitAndFormatMessage = (message: string) => {
  const [command, complement, text] = message.trim().replace(' ', '#').split('#')

  return {
    command,
    complement,
    text
  }
}

const sendingMessage =(request: AxiosInstance) => 
  async (contact:BodySendingText) => (await request({data: JSON.stringify(contact)})).data

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

const testAnItemAgaintsVariousData = <T extends {[key:string]:any}>(data:T[]) => 
  (item:string) => 
  <E>(value:E) => {
    const dataItem = data.find(element => element[item] === value)
    if(dataItem){
      return dataItem
    } 
    throw 'Mentoria inválida'
  }

const testContentArray = <T>(array:T[]) => async (value:T) => {
  const result = array.find(element => element === value)
  if(result) return result
  throw 'Comando inválido'
}

const senderIsMentorOrParticipant = (from: string) => (mentoring:Mentoring) => {
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

const formatContactMessageText = (contact:{from: string, to:string, message:string}):BodySendingText => ({
  from: contact.from,
    to: contact.to,
    contents:[{ 
      type: 'text',
      text: contact.message
    }]
})

const formatMultContactsMessageText = (from: string) => 
  (contacts:MessageAndTo[]) => contacts.map(({message, to})=> formatContactMessageText({from, to, message}))

export {
  compose,
  toLowerCase,
  splitAndFormatMessage,
  setAxiosConfig,
  sendingMessage,
  formatMultContactsMessageText,
  testAnItemAgaintsVariousData,
  testContentArray,
  senderIsMentorOrParticipant,
  formatContactMessageText
}