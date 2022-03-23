import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from './_models/member';


// const httpsOptions={
//   headers: new HttpHeaders({
//     Authorization: 'Bearer '+ JSON.parse(localStorage.getItem('user'))?.token
//     //solu respuestas de personas del curso udemy aunque da lo mismo que lo de arriba
//     //Authorization:'Bearer '+ JSON.parse(localStorage.getItem('user')?localStorage.getItem('user')!:"{}").token

//     //pongo ? porque si no la property can not read token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }


  getMembers() {
    return this.http.get<Member[]>(this.baseUrl+'users');//al hacer interceptor del token
    //borramos el paramatro de ,httpOptions
  }

  getMember(username:string) {//nos aseguramos de poner string para que NO puedar ser otra cosa
    return this.http.get<Member>(this.baseUrl+'users/'+username);//,httpOptions
  }


}
