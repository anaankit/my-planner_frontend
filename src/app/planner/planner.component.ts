import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { setHours, setMinutes } from 'date-fns';
import { DatePipe } from '@angular/common';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subMonths,
  addMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
  import { NgbModal,NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { PlannerServiceService } from '../planner-service.service';
import { Subject, timer } from 'rxjs';
import { UserService } from '../user.service';
import * as moment from 'moment';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { SocketService } from '../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';

type CalendarPeriod = 'day' | 'week' | 'month';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};



function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}


@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  view: CalendarPeriod = 'month';

  // @ViewChild('modalContent') modalContent: TemplateRef<any>;
  // @ViewChild('remainder') remainder: TemplateRef<any>;
  // @ViewChild('day') day: TemplateRef<any>;


  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
    
  // };

  // EventColor:{
  //   primary:String;
  //   secondary:String;
  // }


  constructor(public router:Router ,public modal: NgbModal,public plannerService:PlannerServiceService,public userService:UserService,public socketService:SocketService) { }

  ngOnInit() {
    this.routeCheck();
    this.getAllEvents();
    this.register();
    this.checkAdd();
    this.checkEdit();
    this.checkDelete();
    setTimeout(() => {
      this.remainderFunction();  
    }, 1000);
    
  }


  //code for limiting the number of  months

  minDate: Date = subMonths(new Date('2018-02-01'), 1);

  maxDate: Date = addMonths(new Date('2018-11-30'), 1);

  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }  

  increment(): void {
    this.changeDate(addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  


  //BEGGINING OF NEW CODE

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalContent1') modalContent1: TemplateRef<any>;
  @ViewChild('remainder') remainder: TemplateRef<any>;
  @ViewChild('newAdd') newAdd: TemplateRef<any>;
  @ViewChild('newEdit') newEdit: TemplateRef<any>;
  @ViewChild('newDelete') newDelete: TemplateRef<any>;

  

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event:CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  public userDetails = this.userService.getUserInfoFromLocalStorage();
public allEvents;
  public getAllEvents = () =>{

    this.events = [];
    this.plannerService.getAllEventsUsingId(this.userDetails.userId).subscribe((response)=>{
      this.allEvents = response.data;
      
      for(let each of response.data){
        this.addEvent(each);
      }

           
    })
    this.refresh.next();
  } // end of get all events

  events: CalendarEvent[] = [
    
  ];

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        this.viewDate = date;  
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }

    this.modal.open(this.modalContent1, { size: 'lg' });

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  public currentClickedEvent;
  handleEvent(action: string, event: CalendarEvent): void {

    for(let each of this.allEvents){
      if(event.id == each.id){
        this.currentClickedEvent = each;
      }
    }
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }


  addEvent(each): void {
    this.events.push({
      title:each.title,
      id:each.id,
      start:new Date(each.start),
      end: new Date(each.end),
      color: colors.yellow,
      draggable: false,
      resizable: {
        beforeStart:false,
        afterEnd:false
      }
    });
    this.refresh.next();
  }

  public remainderInfo;
  public remainderFunction = () =>{
    let action="click";
    // console.log('running')
    for(let each of this.allEvents){


      if(moment(each.start).format('MM')==moment().format('MM')){

        if(moment(each.start).format('DD')==moment().format('DD')){

          if(moment(each.start).format('HH')==moment().format('HH')){

            let a = parseInt(moment(each.start).format('mm'))
             let b = parseInt(moment().format('mm'));
             
             if((a-b)==1){
               this.remainderInfo = each;
              this.modal.open(this.remainder,{size:'lg'})
              
             }
          }

        }

      }

    }

setTimeout(() => {
this.remainderFunction();
}, 55000);
  } // end of remainder function


  public snooze = () =>{
    this.click(1,1);
    setTimeout(() => {
      this.click(1,1);
      this.modal.open(this.remainder,{size:'lg'});
    }, 5000);

  } //  end of snooze

  public click(x,y){
    var ev = document.createEvent("MouseEvent");
    var el = document.elementFromPoint(x,y);
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        x, y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
} //  end of click


  public register = () =>{

    this.socketService.sendUserId().subscribe((data)=>{
      this.socketService.userId(this.userDetails.userId);
    })
  }

  public eventsAdded;
  public checkAdd = () =>{
    this.socketService.check().subscribe((data)=>{
      this.getAllEvents()
      this.refresh.next();
      this.eventsAdded = data;
      setTimeout(() => {
        this.modal.open(this.newAdd, { size: 'sm' });
      }, 500);
    })
   
  }


public eventEdited;
  public checkEdit = () =>{

    this.socketService.checkEdit().subscribe((data)=>{
      this.getAllEvents()
      this.refresh.next();
    this.eventEdited = data;  
    // this.getAllEvents();
    setTimeout(() => {
      this.modal.open(this.newEdit, { size: 'sm' });
      
    }, 500);
   
    })

  }

  public deletedEvent;
  public checkDelete = () =>{
    
    this.socketService.checkDelete().subscribe((data)=>{
      this.getAllEvents()
      this.refresh.next();
      for(let each of this.allEvents){
        if(each.id==data.id){
          this.deletedEvent = each;
        }
        
      }

      // this.getAllEvents();

      setTimeout(() => {
        this.modal.open(this.newDelete, { size: 'sm' });  
      }, 500);
      
    })

   
  }

  public logout = () => {
    
    Cookie.delete('authToken');
    this.router.navigate(['/about'])
  }

  public routeCheck = () =>{

    if(Cookie.get('authToken')==''||Cookie.get('authToken')==null||Cookie.get('authToken')==undefined||(!Cookie.get('authToken'))){
      this.router.navigate(['/login'])
    }

  }

  }























// END OF  NEW CODE 






  

//   public userDetails = this.userService.getUserInfoFromLocalStorage();
//   public remainderModal;
//   public eventsArray: CalendarEvent[] = [];
  
//   //getting all events from db
//   //  end og get all events


//   public view: string = 'month';

//   viewDate: Date = new Date('2018-07-29');
//   refresh: Subject<any> = new Subject();
  

//   public globalEvenResponseData;
  
//   public getAllEvents = () =>{  
//     this.events = [];
//     let user = this.userService.getUserInfoFromLocalStorage()
//     console.log(user.userId)

//     this.plannerService.getAllEventsUsingId(user.userId).subscribe((response)=>{
      
//       console.log(response.data)

//       for(let each of response.data){

//         // console.log(each.startDate.slice(0,10)+' '+each.startTime)

//         for(let each1 of response.data){

//           var x = new Date('01/01/2001'+' '+each.startTime).getTime();
//           var y = new Date('01/01/2001'+' '+each.endTime).getTime();
            
//           var a = new Date('01/01/2001'+' '+each1.startTime).getTime();
//           var b = new Date('01/01/2001'+' '+each1.endTime).getTime();  
    
//           if ( (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) && (each.id != each1.id) && (each.startDate == each1.startDate)  )  {
            
            
//             each.draggable = true;
//             each1.draggable =  true;
    
//         } else{
//           // each.draggable = false;
//         }
    
//         }
//       }

//       for(let each of response.data){
//         this.events.push({
//           title:each.title,
//           start:new Date(each.startDate.slice(0,10)+' '+each.startTime),
//           end:new Date(each.endDate.slice(0,10)+' '+each.startTime),
//           id:each.id,
//           draggable:each.draggable,
//           color: colors.red  
//         })
//       }
//         this.refresh.next();
      
//       this.globalEvenResponseData = response;
      
//     })
    
//     // console.log(setHours(setMinutes(new Date(), 0), 3))
//     this.refresh.next();

//   } // end of get all events

 
//  public events: CalendarEvent[] = 
//   [
    
      
//   ];

 


//   public sample = setHours(setMinutes(new Date(), 0), 5);
//   // public generic =  new Date("25");
//   // public dayClicked =(event)=>{
//   //   console.log(this.sample);
//   //   console.log(this.generic);
//   //   console.log(event);
//   //   alert('this day'+event.date);


//   // }

  


//   activeDayIsOpen: boolean = true;
//   private newMethod_1(): CalendarEvent<any> {
//     return this.eventsArray[0];
//   }

//   private newMethod(each: any) {
//     this.events.push(each);
//   }
//   public clickedDayEventsGlobal = [];
//   public globalDaySelectedRaw;
//   public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
//     this.globalDaySelectedRaw = date;
//     let d = moment(date).format('YYYY-MM-DD');
//     let details = {
//       userId:this.userDetails.userId,
//       startDate:d
//     }
//     this.plannerService.getEventsOfDay(details).subscribe((response)=>{
      
//       this.clickedDayEventsGlobal = response.data;
//       console.log(this.clickedDayEventsGlobal);

//     })

//     // for(let x in this.clickedDayEventsGlobal){

//     //  let h = this.clickedDayEventsGlobal[x].startTime.slice(0,2);
//     //   console.log(h);

//     //   let i = this.clickedDayEventsGlobal[x].endTime.slice(0,2);

//     //   let j = this.clickedDayEventsGlobal[x+1].startTime.slice(0,2)

//     //   let k = this.clickedDayEventsGlobal[x+1].endTime.slice(0,2);


//     // }
    
//     for(let each of events){

//       // console.log(Date.parse('01/01/2011'+' '+each.startTime));

//       for(let each1 of events){

// //         if( ( ( Date.parse('01/01/2011'+' '+each1.startTime) >= Date.parse('01/01/2011'+' '+each.startTime)  ) || ( Date.parse('01/01/2011'+' '+each1.endTime) <= Date.parse('01/01/2011'+' '+each.endTime) ) ) && each.id!=each1.id )
// // {
// //   console.log('found finally');
// // }

//       var x = new Date(each.start).getTime();
//       var y = new Date(each.end).getTime();
        
//       var a = new Date(each1.start).getTime();
//       var b = new Date(each1.end).getTime();  

//       if ( (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) && each.id != each1.id )  {
        
//         // console.log('overlapped');
       
        

//     }

//     }

//       }
    


//     if (isSameMonth(date, this.viewDate)) {
//       if (
//         (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
//         events.length === 0
//       ) {
//         this.activeDayIsOpen = false;
//       } else {
//         this.activeDayIsOpen = true;
//         this.viewDate = date;
//       }
//     }
//     this.refresh.next();

//     this.modal.open(this.day);  
   

    

//   } // end of day clicked function

//   public globalOverlapping = false;
  
//   handleEvent(action: string, event: CalendarEvent): void {

//     // let details = {
//     //  userId:this.userDetails.userId,
//     //   startDate:moment(event.start._i).format('YYYY-MM-DD')
//     // }
    
    
//     // this.plannerService.getEventsOfDay(details).subscribe((response) => {
      
//     //   console.log(moment(event.start._i).format('HH:mm'))

//     //   for(let each of response.data){
    
//     //     var x = new Date('01/01/2001'+' '+moment(event.start._i).format('HH:mm')).getTime();
//     //     var y = new Date('01/01/2001'+' '+moment(event.start._i).format('HH:mm')).getTime();
        
//     //     var a = new Date('01/01/2001'+' '+each.startTime).getTime();
//     //     var b = new Date('01/01/2001'+' '+each.endTime).getTime();  
        
//     //     if ( (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) && (each.id != event.id ))  {

//     //       event.draggable = true;
         
//     //       // console.log('duplicate found');

//     //     } 
//     //   }
    
//     // })
    
    
//     // // console.log(event.start._i);

// console.log(event);
// this.globalOverlapping = event.draggable

//     this.modalData = { event, action };
    
//       this.modal.open(this.modalContent, { size: 'lg' });  

    

//   }

  
//   public remainderFunction = () =>{

//     let t = moment().format('L');

//     let details={
//       userId:this.userDetails.userId,
//       startDate:moment().format('YYYY-MM-DD')
//     }

//     this.plannerService.getEventsOfDay(details).subscribe((response)=>{
//       console.log(response.data)
//     for(let each of response.data){
//       // console.log('running')
//       let a = parseInt(moment().format('HH:mm')) 
//       let b = parseInt(each.startTime);
//       // console.log(a);
//       // console.log(b);

//       let c = moment().format('HH:mm');
//       c = c.slice(3);
//       // console.log(c);

//       let d = each.startTime;
//       d = d.slice(3,5);
//       // console.log(d);

//       let e = parseInt(c);
//       let f = parseInt(d);
//       let g = e-f;
//       // console.log(g)
//       if(a==b){

//         if(g== -1){
//         this.remainderModal =  this.modal.open(this.remainder, { size: 'lg' })
//           }
//       }
//     }      
//     })
//     setTimeout(() => {
//     this.remainderFunction()  
//     }, 50000);
    
//   } // end of remainder function

//   public snooze = () =>{
//     this.click(1,1);
    
//     setTimeout(() => {
//       this.modal.open(this.remainder);
//     }, 5000);

//   } //  end of snooze


//   public click(x,y){
//     var ev = document.createEvent("MouseEvent");
//     var el = document.elementFromPoint(x,y);
//     ev.initMouseEvent(
//         "click",
//         true /* bubble */, true /* cancelable */,
//         window, null,
//         x, y, 0, 0, /* coordinates */
//         false, false, false, false, /* modifier keys */
//         0 /*left*/, null
//     );
//     el.dispatchEvent(ev);
// } //  end of click


//   public eventDay:CalendarEvent[] = [];

//   public uff = ()=>{

//     let d = moment().format('YYYY-MM-DD');

//     let details = {
//       userId:this.userDetails.userId,
//       startDate:d
//     }

//     this.plannerService.getEventsOfDay(details).subscribe((response)=>{
      
//       for(let each of response.data){


//         this.eventDay.push({
//           start:new Date(2018,7,29,15,11,0),
//           end:new Date(2018,7,29,20,12,0),
//           title:each.title,
//           color:colors.red
//         })

//       }


//     })

// console.log(this.eventDay);
//   }  





