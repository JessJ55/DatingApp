import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';


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
  members: Member[]=[];


  constructor(private http: HttpClient) { }


  getMembers() {
    if (this.members.length > 0) return of(this.members);
    
      return this.http.get<Member[]>(this.baseUrl+'users').pipe(
        map(members =>{
          this.members=members;
          return this.members;
        })
      );
    
    //return this.http.get<Member[]>(this.baseUrl+'users');//al hacer interceptor del token
    //borramos el paramatro de ,httpOptions
  }

  getMember(username:string) {//nos aseguramos de poner string para que NO puedar ser otra cosa
    const member=this.members.find(x => x.username ===username)
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl+'users/'+username);//,httpOptions esto es llamada a la API
  }


  updateMember(member:Member){

    return this.http.put(this.baseUrl+'users',member).pipe(
      map(() => {
        const index=this.members.indexOf(member);
        this.members[index]=member;
      })
    );
  }

  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/'+ photoId,{});
  }


  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+ photoId);
  }
}
