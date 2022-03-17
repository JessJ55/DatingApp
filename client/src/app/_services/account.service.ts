import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl='https://localhost:5001/api/';
  private currentUserSource=new ReplaySubject<User>(1)//objeto buffer que almacena valores
  //el & por convencion se pone por que va a ser unobservable
  currentUser$=this.currentUserSource.asObservable();  
  constructor(private http:HttpClient) { }

  login(model: any){
  //esto es un servicio que devuelve un observable y para ejecutarlo
  //debemos subscribirnos a el en componente angular
      //return this.http.post(this.baseUrl + 'account/login',model);
   //hay otra manera con la ayuda de method pipe tuberia mapeando 
   return this.http.post(this.baseUrl + 'account/login',model).pipe(
     map((response: User) => {//al poner el tipo de la interface nos
      //deja acceder a las prop definidas 
       const user =response;
       if (user) {
         localStorage.setItem('user',JSON.stringify(user));
         this.currentUserSource.next(user);
       }
     })
   )
  }
  

register(model:any){//consideramos que un usuario se registra inicia sesion en nuestra solicitud
  return this.http.post(this.baseUrl + 'account/register',model).pipe(
    map((user: User) => {//map para mapear los datos de nuestro usuario
if(user){
  localStorage.setItem('user',JSON.stringify(user));
  this.currentUserSource.next(user);
}
    })
  )
}

setCurrentUser(user: User){
  this.currentUserSource.next(user)
}

logout(){
  localStorage.removeItem('user');
  this.currentUserSource.next(null);
}

}
