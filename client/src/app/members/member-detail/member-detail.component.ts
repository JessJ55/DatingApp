import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/_models/member';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild('memberTabs',{static : true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];//si no inicializamos error en longitud de prop
  user:User;

  constructor(public presence: PresenceService, private route: ActivatedRoute
    , private messageService: MessageService,private accountService : AccountService
    ,private router : Router) {

      this.accountService.currentUser$.pipe(take(1)).subscribe((user => this.user=user));
      this.router.routeReuseStrategy.shouldReuseRoute=() => false;
     }//private memberService: MembersService
  

  ngOnInit(): void {

    //this.loadMember();
    this.route.data.subscribe(data => {
      this.member=data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }]
     this.galleryImages=this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })

    }

    return imageUrls;
  }

  // loadMember() {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
  //     this.member = member; //revisar member.service
  //     //console.log(this.member);
  //     //this.galleryImages = this.getImages();//establecemos las imagenes aqui para que no de error 
  //     //de prop photo undefined pues no se puede crear el member y despues la imagen
  //   })
  // }



  loadMessages() {

    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;//si no pones =messages no funnciona
    })
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active=true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      //this.loadMessages();//es una llamada a API pero lo cambiamos para obtenerlo de nuestra señal

      this.messageService.createHubConnection(this.user,this.member.username);
    }else{
      this.messageService.stopHubConnection();
    }


  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
