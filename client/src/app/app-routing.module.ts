import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate:[AuthGuard],
    children:[
      {path: 'members',component: MemberListComponent, canActivate: [AuthGuard]},
      {path: 'members/:id',component: MemberDetailComponent},
      {path: 'lists',component: ListsComponent},//el path es la ruta al poner
      {path: 'messages',component: MessagesComponent},
    ]
  },
  {path: '*',component: HomeComponent,pathMatch: 'full'}
  //raiz comodin por si el user no pone nada de lo que tenemos programado
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
