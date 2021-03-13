import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminComponent } from './admin/admin/admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';
import { EditFinalUserComponent } from './admin/edit-final-user/edit-final-user.component';
import { FinalUserComponent } from './admin/final-user/final-user.component';
import { ReportComponent } from './admin/report/report.component';
import { SystemUserComponent } from './admin/system-user/system-user.component';
import { EditSystemUserComponent } from './admin/edit-system-user/edit-system-user.component';
import { EditClientComponent } from './admin/edit-client/edit-client.component';

import { AuthGuardService } from '../app/services/auth/auth-guard.service';
import { AnonGuardService } from '../app/services/auth/anon-guard.service';
import { AdminGuardService } from '../app/services/auth/admin-guard.service';
import { EditFinalUserForm } from './admin/edit-final-user/form/edit-final-user-form.component';
import { NotFoundComponent } from './navigation/not-found/not-found.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AnonGuardService] },
  { path: 'test/:id', component: TestComponent, canActivate: [AuthGuardService] },
  { path: 'recovery', component: RecoveryComponent, canActivate: [AnonGuardService] },
  { path: 'registry', component: RegistrationComponent, canActivate: [AnonGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'app', component: NavigationComponent,
    children:[
      { path: 'home', component: HomeComponent },
      { 
        path: 'admin', 
        canActivate: [AdminGuardService],
        children: [
          { path: '', component: FinalUserComponent },
          { path: 'report', component: ReportComponent },
          { path: 'create-client', component: AdminComponent },
          { path: 'system-user', component: SystemUserComponent },
          { path: 'edit-system-user', component: EditSystemUserComponent },
          { path: 'edit-client', component: EditClientComponent },
          { path: 'edit-final-user', component: EditFinalUserComponent },
          { path: "edit-final-user/:userId", component: EditFinalUserForm }
        ]
      }
    ],
    canActivate: [AuthGuardService],
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
