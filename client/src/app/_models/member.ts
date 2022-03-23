import { Photo } from "./photo"

export interface Member {
    id: number
    username: string
    photoUrl: string
    age: number
    knownAs: string
    create: Date
    lastActive: Date
    gender: string
    lookingFor: string
    interests: string
    city: string
    photos: Photo[]
  }
  
