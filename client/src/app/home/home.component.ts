import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
registerMode=false;
//  users: any;
  constructor() { }//private http: HttpClient

  ngOnInit(): void {
//this.getUsers();//se debe inicializar el metodo para que lleve a los demas componentes los datos
  }


registerToggle(){
   this.registerMode=!this.registerMode;
}


//  public getUsers()//este metodo obtener los users de la API y debemos llamarlo en onInit 
//  {
//   this.http.get('https://localhost:5001/api/users').subscribe(users => this.users=users);
  
//  }

public cancelRegisterMode(event: boolean){
  this.registerMode=event; //usamos el evento 
}

}
