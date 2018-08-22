import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(public userService:UserService,public router:Router,public socketService:SocketService,public _router:ActivatedRoute) { }

  public token;
  public date =  new Date();
  ngOnInit() {

    this.token = this._router.snapshot.paramMap.get('token');

    this.getInfoUsingToken(this.token)

  }
  public emailReceived;
  public getInfoUsingToken = (token) =>{
    this.userService.getInfoUsingToken(token).subscribe((response)=>{
      // console.log(response)
      if((response.data[0].PasswordResetToken == this.token) && (Date.parse(`${response.data[0].PasswordResetExpiration}`) > Date.parse(`${this.date}`))){
        // console.log('user verified')
        this.emailReceived = response.data[0].email
      }else{
        alert('some error occured')
        this.router.navigate(['/login'])
      }

    },((err)=>{
      this.router.navigate(['/login'])
    }))
  }


public password;
  public update = () =>{

    if(!this.emailReceived){
      alert('error has occured, please try again')
    }else if(!this.CheckPassword(this.password)){
      alert('Your password mmust be between 7 to 15 characters which contain at least one numeric digit and a special character.')
    }else{

    let details = {
      email:this.emailReceived,
      password:this.password
    }
    this.userService.updatePassword(details).subscribe((response)=>{
      // console.log(response);
      
      if(response.status === 200){
        alert('password changed successfully');
        this.router.navigate(['/login'])
      }else{
        alert(response.message);
      }
    })
    
  }
}


  public CheckPassword(inputtxt) { 
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


}
