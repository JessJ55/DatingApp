import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members$:Observable< Member[]>;//el $ por convencion nos dice que ahora es un objeto OVservable


  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    //this.loadMembers();//siempre inicializarlo en onInit poara que se ejecute
    this.members$=this.memberService.getMembers();
  }


  // loadMembers(){
  //   this.memberService.getMembers().subscribe(members => {
  //     this.members=members;
  //   });
  // }

}
