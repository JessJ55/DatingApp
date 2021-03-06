import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  //el host nos permite acceder a eventos de nuestro navegador antes de cerrar
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if (this.editForm.dirty) {
      $event.returnValue=true;
    }
  }
  

    constructor(private accountService: AccountService, private memberService: MembersService
      , private toastr: ToastrService) {
    //el usuario actual es un observable este de aqui abajo 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember() {

    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated succefully')
    this.editForm.reset(this.member);
    })
    
  }
}
