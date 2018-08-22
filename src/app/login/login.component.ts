import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {Router} from '@angular/router'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../socket.service';
import {SnotifyService} from 'ng-snotify';


const shortid = require('shortid');





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email;
  public password;

  constructor(private snotifyService: SnotifyService,public userService:UserService,public router:Router , public socketService:SocketService) { }

  ngOnInit() {
  
  }


  
  
  public loginFunction = ():any=>{

    if(!this.email){
      alert('email not present')
    }else if(!this.password){
      alert('password not present')
    }else{

    let loginDetails = {
      email:this.email,
      password:this.password
    }
    
    this.userService.login(loginDetails).subscribe((response)=>{
      

      if(response.status===200){ 
        Cookie.set('authToken',response.data.authToken);
       
        this.userService.setUserInfoInlocalStorage(response.data.userDetails);
      

        if(response.data.userDetails.userType === 'normal'){

          // this.router.navigate(['/planner'])
          window.location.replace("/planner");
        }else{

          // this.router.navigate(['/admin-home'])
          window.location.replace("/admin-home");

        }

      }else{
        alert(response.message)
      }
    },(err)=>{
      alert('error while loggin in')
    })

  
  }


  }

  public forgotPassword = () =>{
    // console.log('forgot password called')
   if(!this.email){
     alert('please enter email to proceed with the password recovery options')
   }else{

    let details = {
      email:this.email,
      PasswordResetToken:shortid.generate(),
      PasswordResetExpiration: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }
    
     this.userService.update(details).subscribe((response)=>{
      //  console.log(response);
       if(response.status===200){
        let mailDetails = {
          receiver:response.data.email,
          subject:'Your password reset Link Is Herre',
          html:`<p>Hi,</p><h4>Below is your password rest link it is valid for a period of 24hrs</h4><br><p>http://my-planner.ankit-here.xyz/reset-passoword/${details.PasswordResetToken}</p><br><p>Regards:</p><p>My-planner Team</p>`
        }
        this.socketService.sendMMail(mailDetails);
        //  this.router.navigate([`reset-passoword/${details.PasswordResetToken}`])
          alert('An email has been sent to you, please click on the link in the email to reset your password');
       }else{
         alert('some error occured, please try again')
       }
     },((err)=>{
       alert(err.message);
     }))
   }

  }




}
