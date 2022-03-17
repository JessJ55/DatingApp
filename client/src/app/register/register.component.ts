import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
//  @Input()  usersFromHomeComponent: any;//Prop para pasar datos del padre a hijo
 @Output() cancelRegister= new EventEmitter();//Prop para pasar datos del hijo a padre
  model: any={}
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

register(){
  // console.log(this.model)
  this.accountService.register(this.model).subscribe(response =>{
    console.log(response);
    this.cancel();
  },error => {
    console.log(error);
  });
}

cancel(){
  //console.log('cancelled');
  this.cancelRegister.emit(false);
}



}
