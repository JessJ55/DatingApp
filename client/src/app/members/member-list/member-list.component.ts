import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
// import { table } from 'console';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members$:Observable< Member[]>;//el $ por convencion nos dice que ahora es un objeto OVservable
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  // pageNumber =1;
  // pageSize=5;

  constructor(private memberService: MembersService) {//, private accountService: AccountService
    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
    //   this.user = user;
    //   this.userParams = new UserParams(user);
    // })

      this.userParams=this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();//siempre inicializarlo en onInit poara que se ejecute
    //this.members$=this.memberService.getMembers();
  }


  loadMembers() {
    // this.memberService.getMembers().subscribe(members => {
    //   this.members=members;
    // });
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;//puede ser que el error este aqui
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
