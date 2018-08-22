import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http'
import { Cookie } from 'ng2-cookies/ng2-cookies';



@Injectable({
  providedIn: 'root'
})
export class PlannerServiceService {

  constructor(public _http:HttpClient) { }

  public userDetails =  JSON.parse(localStorage.getItem('userInfo'));

 public url = "http://my-planner-backend.ankit-here.xyz/api/v1/planner" 

// public url = "http://localhost:3000/api/v1/planner"

  private authToken = Cookie.get('authToken');

 public getAllEvents = ():any =>{

  return this._http.get(`${this.url}/getEvents/${this.userDetails.userId}?authToken=${this.authToken}`)

 } //  end of get all events

 public getAllEventsUsingId = (userId):any =>{
   return this._http.get(`${this.url}/getEvents/${userId}?authToken=${this.authToken}`)
 } //  end of get all events using Id

 public getEventsOfDay = (details):any =>{
   return this._http.post(`${this.url}/get/event/byDate?authToken=${this.authToken}`,details);
 } // end of get events of day


 public createEvent = (details):any =>{
   return this._http.post(`${this.url}/addEvent?authToken=${this.authToken}`,details);
 }

 public updateEvent = (details):any =>{
   return this._http.post(`${this.url}/editEvent?authToken=${this.authToken}`,details)
 } // end of updateEvent


  public deleteEvent = (details):any =>{
    return this._http.post(`${this.url}/deleteEvent?authToken=${this.authToken}`,details);
  }// end of deleteEvent

  
}
