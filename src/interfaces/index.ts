// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';

export type Participant = {
  id: number
  name: string,
  whatsapp: string
}

export type Mentor = {
  id: number,
  name: string,
  whatsapp: string
}

export type Team = {
  id: number,
  participants: Participant[]
}

export type Mentoring = {
  id: number,
  date: Date,
  mentor: Mentor,
  team: Team
}
