import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl; //'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<User>(1)//objeto buffer que almacena valores
  //el & por convencion se pone por que va a ser unobservable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,private presence : PresenceService) { }

  login(model: any) {
    //esto es un servicio que devuelve un observable y para ejecutarlo
    //debemos subscribirnos a el en componente angular
    //return this.http.post(this.baseUrl + 'account/login',model);
    //hay otra manera con la ayuda de method pipe tuberia mapeando 
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {//al poner el tipo de la interface nos
        //deja acceder a las prop definidas 
        const user = response;
        if (user) {
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUserSource.next(user);
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {//consideramos que un usuario se registra inicia sesion en nuestra solicitud
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {//map para mapear los datos de nuestro usuario
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
          //localStorage.setItem('user', JSON.stringify(user));
          //this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    //localStorage.setItem('user', JSON.stringify(user));
    //console.log('El usuario desde acount service es '+user.username);
    user.roles=[];
    const roles=this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles=roles : user.roles.push(roles); 

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user)
    //console.log('El usuario desde acount service pero al final es '+user.username);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  getDecodedToken(token){//obtenemos info como jwt.io para sacar info del token
    return JSON.parse(atob(token.split('.')[1]));

  }

}
