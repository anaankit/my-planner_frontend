import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {Router} from '@angular/router'
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(public userService:UserService,public router:Router) { }

  ngOnInit() {
    this.routeCheck()
    this.getAllUsers()

  }

  public allUsers = [];

  public emailToSearch;

  public showSearchResult = false;

  public getAllUsers = ()=>{

    this.userService.getAllUsers().subscribe((response)=>{

      if(response.status === 200){

        this.allUsers = response.data;
        // console.log(this.allUsers)
      }

    })

  } // end of get All Users

  public searchResults = {
    email:'',
    firstName:'',
    lastName:'',
    userId:''
  }
  public search = () =>{
    
    for(let each of this.allUsers){

      if(each.email == this.emailToSearch){
        this.searchResults.email = each.email;
        this.searchResults.firstName = each.firstName;
        this.searchResults.lastName = each.lastName;
        this.searchResults.userId = each.userId;
        this.showSearchResult = true;
      }

    }

  } //  end of search

  public capture = ()=>{

  }

  
  public routeCheck = () =>{

    if(Cookie.get('authToken')==''||Cookie.get('authToken')==null||Cookie.get('authToken')==undefined||(!Cookie.get('authToken'))){
      this.router.navigate(['/login'])
    }

  }

  
public logout = () =>{
  Cookie.delete('authToken');
  this.router.navigate(['/about'])
}

}
