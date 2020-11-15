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
