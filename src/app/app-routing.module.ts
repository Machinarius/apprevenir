import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { TestComponent as AdminTestComponent} from './admin/test/test.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminComponent } from './admin/admin/admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';
import { EditFinalUserComponent } from './admin/edit-final-user/edit-final-user.component';
import { FinalUserComponent } from './admin/final-user/final-user.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'test', component: TestComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'registry', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'app', component: NavigationComponent,
    children:[
      { path: 'admin', component: AdminComponent, pathMatch: "full" },
      { path: 'test', component: AdminTestComponent },
      { path: 'final-user', component: FinalUserComponent },
      { path: 'edit-final-user', component: EditFinalUserComponent },
      { path: 'home', component: HomeComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
