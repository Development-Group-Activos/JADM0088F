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
  page: string | null = null;
  emp: string | null = null;
  username: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  RCS_ID: string | null = null;
  ReqId: string = '';
  passwordValid: boolean = true;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  passwordRequirements: string[] = [];

  showHint: boolean = false;
  showConfirmPassword: boolean = false;
  allValidationsPassed: boolean = false;

  selectedOU: { value: string; label: string } | null = null;
  ouOptions: { label: string, value: string }[] = [
    { value: 'ou=empleados', label: 'Empleado' },
    { value: 'ou=Personas', label: 'Persona' },
    { value: 'ou=proveedores', label: 'Proveedor' },
    { value: 'ou=Clientusers', label: 'Cliente' },
    { value: 'ou=Usuarios', label: 'Intranet' }
  ];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { user: string, RequestID: string, page: string, emp: string };
  
    // Asignar valores del estado o de sesión, con un valor por defecto para `emp`
    this.user = state?.user || sessionStorage.getItem('user');
    this.RCS_ID = state?.RequestID || sessionStorage.getItem('RequestID');
    this.page = state?.page || sessionStorage.getItem('page') || 'OFV';
    this.emp = state?.emp || sessionStorage.getItem('emp') || '860090915'; // Valor por defecto si no se recibe `emp`
  
    if (this.user) {
      this.obtenerDominioUsuario();
    }
  }


  obtenerDominioUsuario(): void {
    this.authService.obtenerDominio(this.user!).subscribe(
      (dominio) => {
        this.selectedOU = this.ouOptions.find(option => option.value === dominio) || null;
      },
      (error) => {
        this.messageService.add({
          key: 'passwordToast',
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudo obtener el dominio del usuario, seleccione manualmente.'
        });
      }
    );
  }


  isValidPassword(): boolean {
    this.allValidationsPassed = this.isValidMayus() && this.isValidNumber() && this.isValidCharacter() && this.newPassword.length >= 8;
    return this.allValidationsPassed;
  }

  isValidMayus(): boolean {
    return /[A-Z]/.test(this.newPassword) && /[a-z]/.test(this.newPassword);
  }

  isValidNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  isValidCharacter(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }


  onSubmit() {
    if (!this.newPassword || this.newPassword.trim().length === 0) {
      this.messageService.add({
        key: 'passwordToast',
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña es un campo obligatorio.'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        key: 'passwordToast',
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas ingresadas no coinciden.'
      });
      return;
    }

    if (!this.isValidPassword()) {
      this.messageService.add({
        key: 'passwordToast',
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña no cumple con los requisitos de seguridad.'
      });
      return;
    }

    let ouValue = 'ou=Clientusers';

    if (this.page === 'BMX') {
      if (!this.selectedOU) {
        this.messageService.add({
          key: 'passwordToast',
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Debe seleccionar un perfil.'
        });
        return;
      }
      ouValue = this.selectedOU.value;
    }

    this.username = this.user ?? '';
    this.ReqId = this.RCS_ID ?? '';

    this.authService.updatePassword(this.username, this.newPassword, this.ReqId, ouValue).subscribe(
 
    (respnd) => {
      this.router.navigate(['/success', this.username, this.page || 'OFV', this.emp || '860090915'], {
        state: {}
      });
      },
      (error) => {
        this.messageService.add({
          key: 'passwordToast',
          severity: 'error',
          summary: 'Error',
          detail: error.error  // Muestra el mensaje exacto del backend
        });
      }
    );
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
    this.router.navigate(['/login']);
  }
}