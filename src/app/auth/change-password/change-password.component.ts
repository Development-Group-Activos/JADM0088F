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
  passwordRequirements: string[] = []; // Para mostrar las sugerencias de contraseña

  showHint: boolean = false;
  showConfirmPassword: boolean = false;

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
    const hasUppercase = /[A-Z]/.test(this.newPassword);
    const hasLowercase = /[a-z]/.test(this.newPassword);
    const hasNumber = /[0-9]/.test(this.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
    return this.newPassword.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }

  onSubmit() {
    // Llamar a validatePassword para validar la contraseña
    if (this.isValidPassword() && this.newPassword === this.confirmPassword) {
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
            detail: 'Esta contraseña ya ha sido utilizada'
          });
        }
      );
    } else {
      this.messageService.add({
        key: 'passwordToast',  
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden o no cumplen con los requisitos de seguridad.'
      });
    }
  }


  showPasswordHint() {
    this.showHint = !this.showHint;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);  //cambiar la ruta para que redirija al login de la jadm0017
  }
}
