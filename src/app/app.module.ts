import {  FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { LoginComponent } from './auth/login/login.component';
import { ProfileFormComponent } from './auth/registration/profileForm/profileForm.component';
import { ReferralHierarchyComponent } from "./auth/registration/clientConfig/referralHierarchy/renderer/referralHierarchy.component";
import { HomeComponent } from './home/home.component';
import { ModalComponent } from './auth/modal/modal.component';
import { TestComponent } from './test/test.component';
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
import { ZoneEditModalComponent } from './admin/admin/zone-edit-modal/zone-edit-modal.component';
import { ProfileModalComponent } from './profile/profile-modal/profile-modal.component';
import { HomeModalComponent } from './home/home-modal/home-modal.component';
import { ConfidentialModalComponent } from './test/confidential-modal/confidential-modal.component';
import { LeveModalComponent } from './test/leve-modal/leve-modal.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoaderComponent } from './core/loader/loader.component';
import { EditFinalUserForm } from './admin/edit-final-user/form/edit-final-user-form.component';
import { NotFoundComponent } from './navigation/not-found/not-found.component';
import { ClientConfigComponent } from './auth/registration/clientConfig/client-config.component';
import { PolicyModalComponent } from './auth/policy-modal/policy-modal.component';
import { ChipInputComponent } from './admin/admin/chip-autocomplete/chip-input.component';
import { ReportModalComponent } from './admin/report/report-modal/report-modal.component';

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
    InformationModalComponent,
    ZoneEditModalComponent,
    ProfileModalComponent,
    HomeModalComponent,
    ConfidentialModalComponent,
    LeveModalComponent,
    LoaderComponent,
    EditFinalUserForm,
    NotFoundComponent,
    ClientConfigComponent,
    PolicyModalComponent,
    ChipInputComponent,
    ReportModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMatColorPickerModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
