import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  // @Input() username: string;
  @ViewChild('messageForm') messageForm:NgForm;
  @Input() messages: Message[];
  @Input() username: string;
  messageContent: string;
  //messages: Message[];

  constructor(public messageService: MessageService) { }//private messageService: MessageService


  ngOnInit(): void {
    //this.loadMessages();
  }

   sendMessage(){
    ( this.messageService.sendMessage(this.username, this.messageContent)).then(() =>
      {
       //console.log(message); message si tiene valor
        //this.messages.push(message);//llamada a la API
        this.messageForm.reset();
        //con promesas se usa then en vez de subscribe y no recibimos mensaje de ahi () vacio
      })
  }

  // loadMessages(){
   
  //   this.messageService.getMessageThread(this.username).subscribe(messages =>
  //     {
  //       this.messages=messages;//si no pones =messages no funnciona
  //     })
  // }

  
}
