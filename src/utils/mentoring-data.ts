import {
  Mentoring
} from '../interfaces'

const mentoring:Mentoring[] = [{
  id: 1,
  date: new Date(),
  mentor:{
    id: 1,
    name: 'Ana',
    whatsapp:`${process.env.WHATSAPP_MENTOR}`
  },
  team:{
    id: 1,
    participants:[
      {
        id: 1,
        name: 'Jorge',
        whatsapp: `${process.env.WHATSAPP_PARTICIPANT}`
      }
    ]
  }
},
{
  id: 2,
  date: new Date(),
  mentor:{
    id: 1,
    name: 'Rahmai',
    whatsapp:`${process.env.WHATSAPP_RAHMAI}`
  },
  team:{
    id: 1,
    participants:[
      {
        id: 1,
        name: 'Giuliano',
        whatsapp: `${process.env.WHATSAPP_GIU}`
      }
    ]
  }
},
{
  id: 3,
  date: new Date(),
  mentor:{
    id: 1,
    name: 'Giuliano',
    whatsapp: `${process.env.WHATSAPP_GIU}`
  },
  team:{
    id: 1,
    participants:[
      {
        id: 1,
        name: 'Rahmai',
        whatsapp:`${process.env.WHATSAPP_RAHMAI}`
      }
    ]
  }
}] 

export default mentoring