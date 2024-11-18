import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ExpiredRequestComponent } from './expired-request/expired-request.component';
import { ValidateRequestComponent } from './validate-request/validate-request.component';
import { PasswordSuccessComponent } from './password-success/password-success.component';
import { TooltipModule } from 'primeng/tooltip';





const routes: Routes = [
  {
    path: 'auth/password-reset',
    component: PasswordResetComponent
  }
];

@NgModule({
  declarations: [

    
  ],
  imports: [
    TooltipModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    ExpiredRequestComponent,
    ValidateRequestComponent,
    ChangePasswordComponent,
    PasswordSuccessComponent
  ]
})
export class AuthModule { }
