import 'flatpickr/dist/flatpickr.css';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {RouterModule,Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlannerComponent } from './planner/planner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PlannerServiceService } from './planner-service.service';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminPlannerComponent } from './admin-planner/admin-planner.component';
import { SocketService } from './socket.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AboutComponent } from './about/about.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { FlatpickrModule} from 'angularx-flatpickr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PlannerComponent,
    AdminHomeComponent,
    AdminPlannerComponent,
    PasswordResetComponent,
    AboutComponent,
    NotfoundComponent,
   

  ],
  imports: [
    BrowserModule,
    SnotifyModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    FlatpickrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'planner',component:PlannerComponent},
    {path:'admin-home',component:AdminHomeComponent},
    {path:'admin-planner/:userId',component:AdminPlannerComponent},
    {path:'reset-passoword/:token',component:PasswordResetComponent},
    {path:'about',component:AboutComponent},
    {path:'',component:AboutComponent},
    {path:'*',component:NotfoundComponent},
    {path:'**',component:NotfoundComponent}
    ])
  ],
  providers: [{ provide: 'SnotifyToastConfig', useValue: ToastDefaults},
  SnotifyService,UserService,PlannerServiceService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
