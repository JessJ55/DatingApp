import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container: string = "Unread";
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  constructor(private messageService: MessageService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }


  loadMessages() {//el container pasa como undefined desde la prop no adquiere valor investigar despues
    //solu le he delarado del tipo que es string
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe
      (response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      })
      console.log(this.loading);
  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm delete message', 'This can not be undone')
      .subscribe(result => {
        if (result) {
          
          this.messageService.deleteMessage(id).subscribe(() => {
            this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          })

        }
      })

  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) //esto evita un bucle infinito
    {
      this.pageNumber = event.page;
      this.loadMessages();
    }

  }

}
