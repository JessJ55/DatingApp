import { Component, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any ={}
  //currentUser$: Observable<User>;
// loggedIn: boolean;
  constructor(public accountService: AccountService,private router:Router
    ,private toastr: ToastrService) { }

  ngOnInit(): void {
//this.getCurrentUser();
//this.currentUser$=this.accountService.currentUser$;


  }
  login(){
    //esto de arriba es la function login y lo de abajo es la 
    //subscricion al servcio observable pues si no subcribe no ejecuta
   this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
     //console.log(response);
     //this.loggedIn=true;
     
   }
  //  , error => {
  //    console.log(error);
  //   this.toastr.error(error.error);
  // }
  )
  
  }
/*Lo que podriamos hacer es  RxJS extensiones
reactivas para JS que funcionan con observables ej:

getMembers() {
  return this.http.get('api/users').pipe(
    map(members => {
      console.log(member.id)
      return member.id
    })
    )
  }
    */

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    //this.loggedIn=false;
  }

// getCurrentUser()
// {
//   this.accountService.currentUser$.subscribe(user => {
//     this.loggedIn=!!user;//creo que la !! transofrma al usuario en cualquier valor
//     //si el user es algo es true y si es null es false
//   },error =>{
//     console.log(error);
//   })
// }


}
