import {
  Mentoring
} from '../interfaces'

const mentoring:Mentoring[] = [{
  id: 1,
  date: new Date(),
  mentor:{
    id: 1,
    name: 'Jane',
    whatsapp:`${process.env.WHATSAPP_MENTOR}`
  },
  team:{
    id: 1,
    participants:[
      {
        id: 1,
        name: 'Carlos',
        whatsapp: `${process.env.WHATSAPP_PARTICIPANT}`
      },
      {
        id: 2,
        name: 'Jéssica',
        whatsapp: `${process.env.WHATSAPP_PARTICIPANT}`
      }
    ]
  }
}] 

export default mentoring