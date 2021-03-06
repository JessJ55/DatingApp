import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';


// const httpsOptions={
//   headers: new HttpHeaders({
//     Authorization: 'Bearer '+ JSON.parse(localStorage.getItem('user'))?.token
//     //solu respuestas de personas del curso udemy aunque da lo mismo que lo de arriba
//     //Authorization:'Bearer '+ JSON.parse(localStorage.getItem('user')?localStorage.getItem('user')!:"{}").token

//     //pongo ? porque si no la property can not read token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;
  // paginatedResult:PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient, private accountService: AccountService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params
  }

  resetUserParams() {

    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {//page?: number,itemsPerPage?:number iba en getMembers como parametros
    //if (this.members.length > 0) return of(this.members);
    //let params=new HttpParams();
    //console.log(Object.values(userParams).join('-'));
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    //console.log('El usuario desde memberservice es '+this.user.knownAs);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }))

    // if(page !== null && itemsPerPage!== null){
    //   params=params.append('pageNumber',page.toString());
    //   params=params.append('pageSize',itemsPerPage.toString());
    // }

    //return this.http.get<Member[]>(this.baseUrl+'users');//al hacer interceptor del token
    //borramos el paramatro de ,httpOptions

    // return this.http.get<Member[]>(this.baseUrl+'users',{observe: 'response',params}).pipe(
    //   // map(members =>{
    //   //   this.members=members;
    //   //   return this.members;
    //   // })
    //   map(response => {
    //     this.paginatedResult.result=response.body;
    //     if (response.headers.get('Pagination') !== null) {
    //       this.paginatedResult.pagination=JSON.parse(response.headers.get('Pagination'));
    //     }
    //     return this.paginatedResult;
    //   })
    // )
    
  }


  getMember(username: string) {//nos aseguramos de poner string para que NO puedar ser otra cosa
    // const member = this.members.find(x => x.username === username)
    // if (member !== undefined) return of(member);
    //console.log(this.memberCache);
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }

    //console.log(member); 
    return this.http.get<Member>(this.baseUrl + 'users/' + username);//,httpOptions esto es llamada a la API
  }

  updateMember(member: Member) {

    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }


  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber, pageSize) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
    //return this.http.get<Partial<Member []>>(this.baseUrl+ 'likes?predicate='+predicate);
  }


  // private getPaginatedResult<T>(url, params) {
  //   const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  //   return this.http.get<T>(url, { observe: 'response', params }).pipe(
  //     // map(members =>{
  //     //   this.members=members;
  //     //   return this.members;
  //     // })
  //     map(response => {
  //       paginatedResult.result = response.body!;
  //       if (response.headers.get('Pagination') !== null) {
  //         paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
  //       }
  //       return paginatedResult;
  //     })
  //   );
  // }

  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let params = new HttpParams();


  //   params = params.append('pageNumber', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());

  //   return params;
  // }

}
