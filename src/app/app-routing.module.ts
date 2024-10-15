import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ExpiredRequestComponent } from './auth/expired-request/expired-request.component';
import { ValidateRequestComponent } from './auth/validate-request/validate-request.component';
import { PasswordSuccessComponent } from './auth/password-success/password-success.component';



const routes: Routes = [
  
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'success/:userName', component: PasswordSuccessComponent },
  { path: 'validate-request/:requestId/:userName', component: ValidateRequestComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'expired-request', component: ExpiredRequestComponent },
  { path: '', redirectTo: '/password-reset', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], 
  exports: [RouterModule]
})

export class AppRoutingModule { }
