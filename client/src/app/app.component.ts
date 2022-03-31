import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {//el Oninit produce despues de ctor
  title = 'The Dating app';
  //users: any

  constructor(private http: HttpClient, private accountService: AccountService) { }//iniciar el http en el ctor es pronto
  //en el ctor habia private http: HttpClient
  ngOnInit() {
    // this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    //console.log('El usuario desde appComonent es '+user.roles);
    if (user != null) {
      this.accountService.setCurrentUser(user);
    }
    //console.log('el usuario es '+user)
  }

  //  getUsers()
  //  {
  //   this.http.get('https://localhost:5001/api/users').subscribe(response =>{
  //     this.users=response;
  //   },error => {console.log(error)},

  //   )
  //  }

}
