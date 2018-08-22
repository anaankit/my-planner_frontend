import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ReturnStatement } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public _http:HttpClient) {


   }

   private url = "http://my-planner-backend.ankit-here.xyz/api/v1/users";

      // public url = "http://localhost:3000/api/v1/users"
   
  //  private authToken = `authToken=${}`

   public signupFunction = (data):any=>{

    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('email',data.email)
    .set('password',data.password)
    .set('countryCode',data.countryCode)
    .set('mobileNumber',data.mobileNumber)

    return this._http.post(`${this.url}/signup`,params);


   } //  end of signup Function

   private authToken = Cookie.get('authToken');

   public login =(data):any=>{
     const params = new HttpParams()
     .set('email',data.email)
     .set('password',data.password)

     return this._http.post(`${this.url}/login`,params);

   } //  end of login function

   public getAllUsers = ():any =>{

    return this._http.get(`${this.url}/allUsers?authToken=${this.authToken}`)

  } //  end of get all users

   public setUserInfoInlocalStorage = (data) =>{
     localStorage.setItem('userInfo',JSON.stringify(data));
   }

   public getUserInfoFromLocalStorage = ():any =>{
     return JSON.parse(localStorage.getItem('userInfo'));
   }


   public getAUser = (userId):any =>{
     return this._http.get(`${this.url}/getUser/${userId}`);
   }


   public update = (details):any =>{
     return this._http.post(`${this.url}/update`,details);
   }

   public getInfoUsingToken = (token):any =>{
     return this._http.get(`${this.url}/verify/${token}`);
   }

   public updatePassword = (details):any=>{
     return this._http.post(`${this.url}/updatePassword`,details);
   }
   
}
