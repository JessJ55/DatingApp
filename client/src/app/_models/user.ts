import { StringMap } from "@angular/compiler/src/compiler_facade_interface";


/*Es un archivo TypeScript repasar ademas las interfaces no se 
comportan de igual manera que en C# */
export interface User{
    username: string;
    token: string;
    photoUrl:string;
    knownAs:string;
    gender: string;
    roles: string[];
}