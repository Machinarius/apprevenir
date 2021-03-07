import {  FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './auth/login/login.component';
import { ProfileFormComponent } from './auth/registration/profileForm/profileForm.component';
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
import { InformationModalComponent } from './test/information-modal/information-modal.component';
import { TestDoneModalComponent } from './admin/test/test-done-modal/test-done-modal.component';
import { CommunesModalComponent } from './admin/admin/communes-modal/communes-modal.component';
import { CorrectionsModalComponent } from './admin/admin/corrections-modal/corrections-modal.component';
import { ProfileModalComponent } from './profile/profile-modal/profile-modal.component';
import { HomeModalComponent } from './home/home-modal/home-modal.component';
import { ConfidentialModalComponent } from './test/confidential-modal/confidential-modal.component';
import { LeveModalComponent } from './test/leve-modal/leve-modal.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoaderComponent } from './core/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileFormComponent,
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
    InformationModalComponent,
    TestDoneModalComponent,
    CommunesModalComponent,
    CorrectionsModalComponent,
    ProfileModalComponent,
    HomeModalComponent,
    ConfidentialModalComponent,
    LeveModalComponent,
    LoaderComponent
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
