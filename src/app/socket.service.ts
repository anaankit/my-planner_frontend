import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import {Observable, observable} from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HttpErrorResponse, HttpParams } from "@angular/common/http";




@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public url = "my-planner-backend.ankit-here.xyz/"
    // public url = "http://localhost:3000/"
  public socket;

  constructor(public http:HttpClient) {
    this.socket = io(this.url);
  }

  public sendUserId = () =>{

    return Observable.create((observer)=>{

      this.socket.on('sendUserId',(data)=>{
        observer.next(data)
      })

    })

  }


  public check = () =>{
    return Observable.create((observer) =>{
      this.socket.on('newEventAdded',(data)=>{
        observer.next(data);
      })

    })
  }

  public checkEdit = () =>{
    return Observable.create((observer) =>{
      this.socket.on('eventEdited',(data)=>{
        observer.next(data);
      })

    })
  }

  public checkDelete = () =>{
    return Observable.create((observer) =>{
      this.socket.on('eventDeleted',(data)=>{
        observer.next(data);
      })

    })
  }

  // events to be emitted
  public userId = (id)=>{
    this.socket.emit('userId',id)
  } 

  public newEvent = (details) =>{
    this.socket.emit('newEvent',details)
  }

  public eventEdited = (details) =>{
    this.socket.emit('eventEdited',details)
  }

  
  public eventDeleted = (details) =>{
    this.socket.emit('eventDeleted',details)
  }

  public sendMMail = (details) =>{
    this.socket.emit('sendMail',details);
  }
   

}
