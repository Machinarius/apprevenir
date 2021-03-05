import {  FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ReferralHierarchyComponent } from "./auth/registration/referralHierarchy/renderer/referralHierarchy.component";
import { HomeComponent } from './home/home.component';
import { ModalComponent } from './auth/modal/modal.component';
import { TestComponent } from './test/test.component';
import { TestComponent as AdminTestComponent } from "./admin/test/test.component";
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { ModalHomeQuestionComponent } from './modals/modal-home-question/modal-home-question.component';
import { AdminComponent } from './admin/admin/admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';
import { FinalUserComponent } from './admin/final-user/final-user.component';
import { EditFinalUserComponent } from './admin/edit-final-user/edit-final-user.component';
import { ReportComponent } from './admin/report/report.component';
import { SystemUserComponent } from './admin/system-user/system-user.component';
import { EditSystemUserComponent } from './admin/edit-system-user/edit-system-user.component';
import { EditClientComponent } from './admin/edit-client/edit-client.component';

import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ReferralHierarchyComponent,
    HomeComponent,
    ModalComponent,
    TestComponent,
    RecoveryComponent,
    ModalHomeQuestionComponent,
    AdminComponent,
    NavigationComponent,
    ProfileComponent,
    FinalUserComponent,
    EditFinalUserComponent,
    ReportComponent,
    SystemUserComponent,
    EditSystemUserComponent,
    EditClientComponent,
    AdminTestComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
