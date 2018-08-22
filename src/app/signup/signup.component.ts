import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName;
  public lastName;
  public email;
  public password;
  public mobileNumber;
  public countryCode;


  constructor(public userService:UserService,public socketService:SocketService,public router:Router) { }

  ngOnInit() {
  }

  public signupFunction:any=()=>{

    if(!this.firstName){
      alert('first Name missing')
    }else if(!this.lastName){
      alert('last name missing')
    }else if(!this.ValidateEmail(this.email)){
      // alert('email missing');
    }else if(!this.phonenumberCheck(this.mobileNumber)){
      alert('mobile number is not valid')
    }else if(!this.countryCode){
      alert('country code missing')
    }else if(!this.CheckPassword(this.password)){
      alert('Your password mmust be between 7 to 15 characters which contain at least one numeric digit and a special character.')
    }else{
      let signupDetails = {

        firstName:this.firstName,
        lastName:this.lastName,
        password:this.password,
        email:this.email,
        mobileNumber:this.mobileNumber,
        countryCode:this.countryCode,
        
      }

      this.userService.signupFunction(signupDetails).subscribe((response)=>{

        if(response.status===200){
          alert('signup successfull')

          
    let mailDetails = {
      receiver:response.data.email,
      subject:'Welcome to My-Planner',
      html:`<p>Hi,</p><h4>My-Planner</h4><br><p>Thank you for joining My-Planner, we are happy to have you on board</p><br><p>Regards:</p><p>My-Planner team</p>`
    }

    this.socketService.sendMMail(mailDetails);

    this.router.navigate(['/login'])
        }else{
          alert('signup unsuccessfull')
        }

      },(err)=>{
        alert(err.error.message);
      })
    }

  } //  end of signup function


  // test code here

  public ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
} // end of email validation


public CheckPassword(inputtxt) 
{ 
// var passw=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
if(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(inputtxt)) 
{ 
return true;
}
else
{ 
return false;
}
} // end of password validation

public phonenumberCheck(inputtxt)
{
  var phoneno = /^\d{10}$/;
  if((/^\d{10}$/.test(inputtxt)))
        {
      return true;
        }
      else
        {
        return false;
        }
} // end of phone number check


  // end of test code






}
