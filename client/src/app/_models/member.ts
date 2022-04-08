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
    //introduction: string; //son los 2 campos que me falta de migrar 
    lookingFor: string
    interests: string
    city: string
    //country: string;
    photos: Photo[]
  }
  
