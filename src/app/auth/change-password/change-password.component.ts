import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-change-password',
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    DialogModule,
    CommonModule,
    DropdownModule,
    PasswordModule,
    DividerModule
  ],
  providers: [MessageService]
})
export class ChangePasswordComponent {
  user: string | null = null;
  username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  RCS_ID: string | null = null;
  ReqId: string = '';
 // displaySuccess: boolean = false;
  passwordValid: boolean = true; // Para validar caracteres de la password
  showPassword: boolean = false; // Controla la visibilidad de la contraseña
  showPassword2: boolean = false;
  passwordRequirements: string[] = []; // Para mostrar las sugerencias de contraseña

  showHint: boolean = false;
  showConfirmPassword: boolean = false;
  allValidationsPassed: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string, RequestID: string };

    this.user = state?.user || sessionStorage.getItem('user');
    this.RCS_ID = state?.RequestID || sessionStorage.getItem('RequestID');
  }

 
  // Función para validar si la contraseña es válida
  isValidPassword(): boolean {
    this.allValidationsPassed = this.isValidMayus() && this.isValidNumber() && this.isValidCharacter() && this.newPassword.length >= 8;
    return this.allValidationsPassed;
  }




  isValidMayus(): boolean {
    const hasUppercase = /[A-Z]/.test(this.newPassword);
    const hasLowercase = /[a-z]/.test(this.newPassword);
    return hasUppercase && hasLowercase;
  }

  isValidNumber(): boolean {
    const hasNumber = /[0-9]/.test(this.newPassword);
    return hasNumber;
  }

  isValidCharacter(): boolean {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
    return hasSpecialChar;
  }

  onSubmit() {
    if (!this.newPassword || this.newPassword.trim().length === 0) {
      this.messageService.add({
        key: 'passwordToast',
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña es un campo obligatorio. Por favor, ingresa tu contraseña para continuar.'
      });
      return; // Detener la ejecución si el campo está vacío
    }
    // Llamar a validatePassword para validar la contraseña
    if (this.newPassword === this.confirmPassword) {
      if (this.isValidPassword()) {
      const ouValue = 'ou=Clientusers'; // Dominio del usuario
      this.username = this.user ?? '';
      this.ReqId = this.RCS_ID ?? '';

      this.authService.updatePassword(this.username, this.newPassword, this.ReqId, ouValue).subscribe(
        (respnd) => {
          if (respnd) {
            this.router.navigate(['/success', this.username], {
              state: {}
            });
          } else {
            this.messageService.add({
              key: 'passwordToast',
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar la contraseña'
            });
          }
        },
        (error) => {
          // Manejo del error
          this.messageService.add({
            key: 'passwordToast',
            severity: 'error',
            summary: 'Error',
            detail: 'Error la nueva contraseña no debe ser igual a las ultimas 5 contraseñas anteriores'
          });
        }
      );
    } 

    else {
      this.messageService.add({
        key: 'passwordToast',  
        severity: 'error',
        summary: 'Error',
        detail: 'No cumple con los requisitos para crear una contraseña segura.'
      });
    }

   }
    else {
      this.messageService.add({
        key: 'passwordToast',  
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas ingresadas no coinciden. Por favor, verifica que ambas contraseñas sean idénticas e intenta nuevamente.'
      });
    }
  }


  showPasswordHint() {
    this.showHint = !this.showHint;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);  //cambiar la ruta para que redirija al login de la jadm0017
  }
}
