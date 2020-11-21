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

export type BodySendingText = {
  from: string,
  to: string,
  contents: [
    {
      type: string,
      text: string
    }
  ]
}

export type Method = "get" | "GET" | 
  "delete" | "DELETE" | 
  "head" | "HEAD" | 
  "options" | "OPTIONS" | 
  "post" | "POST" | 
  "put" | "PUT" | 
  "patch" | "PATCH" | 
  "purge" | "PURGE" | 
  "link" | "LINK" | 
  "unlink" | "UNLINK" | undefined


export type MessageAndTo = {message: string, to: string}