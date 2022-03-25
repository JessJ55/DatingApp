import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //  @Input()  usersFromHomeComponent: any;//Prop para pasar datos del padre a hijo
  @Output() cancelRegister = new EventEmitter();//Prop para pasar datos del hijo a padre
  //model: any = {} //al final de seccion 12 no lo usamos mas
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[]=[];//inicializar array importante si no error undefined

  constructor(private accountService: AccountService, private toastr: ToastrService
    ,private fb:FormBuilder, private router : Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

  }

   initializeForm() {
    // this.registerForm = new FormGroup({ //una manera
    //   //esto es para controlar las validaciones de los inputs
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required,this.matchValues('password')])
    // });
    // this.registerForm.controls.password.valueChanges.subscribe(() => {
    //   this.registerForm.controls.confirmPassword.updateValueAndValidity();
    // })
    this.registerForm=this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      //cuando son varias validaciones van en [] para que sean observables o promeses
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    })
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
       ? null : { isMatching: true}
    }
  }

  register() {
    // console.log(this.model)
    //console.log(this.registerForm.value);sirve para ver los valores del form
    // this.accountService.register(this.model).subscribe(response =>{
      this.accountService.register(this.registerForm.value).subscribe(response =>{
      //console.log(response);
      this.router.navigateByUrl('/members');
      this.cancel();
    },error => {
      this.validationErrors=error;
      // console.log(error);
      // this.toastr.error(error.error);
    });
  }

  cancel() {
    //console.log('cancelled');
    this.cancelRegister.emit(false);
  }



}
