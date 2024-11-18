import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService} from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from 'src/environments/environment.development';
import { MessagesModule } from 'primeng/messages';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-password-reset',
  standalone: true,
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  imports: [
    FormsModule,
    CardModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule,
    MessagesModule,
    CommonModule
  ],
  providers: [MessageService, AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordResetComponent {
  user: string = '';
  displayDialog: boolean = false;
  //correo_envio: string = 'kpaz@activos.com.co';
  mail_envio:string='';
  requestUrl: string = '';

  RCS_ID: string ='';
  property : string = 'mail';
  successMessage: string | null = null;
  
  alertType: string = '';
  alertMessage: string = '';
  alertMessage2: string = '';
  showAlert: boolean = false;
  showAlert2: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    // Obtenemos el protocolo y el host de la ventana actual y lo concatenamos con la parte restante de la URL
      const host = window.location.protocol;
    this.requestUrl = `${host}${environment.baseUrl}validate-request/`;
  }

  onSubmit() {
    if (!this.user) {
      this.messageService.add({
        key: 'resetPasswordToast',
        severity: 'error',
        summary: 'Error',
        detail: 'Este campo es obligatorio. Por favor, complétalo para continuar'
      });
      return;
    }

     this.displayDialog = true;

    // Encuentra el email para validar si existe

    this.authService.findEmail(this.user, this.property).subscribe(
      (response1) => {
        if (response1) {
          //retrasa el tiempo en que aparece el adialog
          setTimeout(() => {
            this.displayDialog = false;
          }, 5000); 
        
          this.mail_envio = response1;
          this.authService.requestPasswordReset(this.user).subscribe(
            (response) => {
              console.log(response)
              if (response === 'Ya existe una solicitud pendiente') {
                console.log(response)
                this.alertType = 'info';
                this.alertMessage = 'Por favor, revisa tu buzón de correo electrónico para obtener el enlace de recuperación. Si no encuentras el correo en tu bandeja de entrada, asegúrate de revisar también tu carpeta de correo no deseado o contáctanos al correo: oficinavirtual@activos.com.co';
                this.showAlert = true;

                setTimeout(() => {
                  this.showAlert = false;
                }, 5000); // Mostrar la alerta durante 15 segundos

                this.displayDialog = false;
              } else {
                console.log(response)
              setTimeout(() => {
                this.displayDialog = false;
              }, 3000);

              this.RCS_ID = response;
              //console.log(this.requestUrl + this.RCS_ID);
             // console.log('RequesId : ', this.mail_envio, this.user, this.requestUrl + this.RCS_ID + '/' + this.user);

              this.authService.sendResetEmail(this.mail_envio, this.user, this.requestUrl + this.RCS_ID + '/' + this.user).subscribe(
                (resp) => {
                  if (resp) {
                    console.log('SendEmail :');
                  } else {
                    console.log('No llego SendEmail');
                  }
                },
                (error) => {
                  // Manejo de errores para sendResetEmail
                  console.log('Errores al enviar el correo:', error);
                  this.messageService.add({
                    key: 'resetPasswordToast',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo enviar el correo de restablecimiento de contraseña.'
                  });
                }
              );

                //console.log('Respuesta', response);      
                this.alertType = 'warning';
                this.alertMessage = `Se ha enviado la solicitud a ${this.enmascararCorreo(this.mail_envio)}`;
                this.showAlert = true;

                // Opcionalmente, ocultar la alerta después de un tiempo
                setTimeout(() => {
                  this.showAlert = false;
                }, 10000);
              }
            },
            (error) => {
              this.alertType = 'info';
              this.alertMessage2 = 'Por favor, revisa tu buzón de correo electrónico para obtener el enlace <br> de recuperación. Si no encuentras el correo en tu bandeja de entrada,<br> asegúrate de revisar también tu carpeta de correo no deseado o<br> contáctanos al correo: <strong>oficinavirtual@activos.com.co</strong>';
              this.showAlert2 = true;
              setTimeout(() => {
                this.showAlert2 = false;
              }, 10000); // Mostrar la alerta durante 15 segundos
              
              // Manejo de errores para requestPasswordReset
              console.log('Errores', error);
              this.displayDialog = false;
              this.messageService.add({
                key: 'resetPasswordToast',
                severity: 'error',
                summary: 'Error',
                detail: 'Error al procesar la solicitud'       
              });

              
            }
          );
        } else {
          //console.log('No encontró el correo');
          this.messageService.add({
            key: 'resetPasswordToast',
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre de usuario ingresado es incorrecto o no se encuentra registrado. Asegúrate de haberlo escrito correctamente y de que tu cuenta esté activa.'
          });
        }
      },
      (error) => {
        console.log('Errores al buscar el correo:', error);
        this.displayDialog = false;
        this.messageService.add({
          key: 'resetPasswordToast',
          severity: 'error',
          summary: 'Error',
          detail: 'El nombre de usuario ingresado es incorrecto o no se encuentra registrado. Asegúrate de haberlo escrito correctamente y de que tu cuenta esté activa.'
        });
      }
    );

  }

  navigateToLogin() {
    this.router.navigate(['/login']); // cambiar la ruta para que redirija al login de la jadm0017
  }
/*
  enmascararCorreo(correo: string): string {
    const indexArroba = correo.indexOf('@');
    if (indexArroba === -1) {
      return correo;
    }

    const primerosDos = correo.substring(0, 2);
    const dominio = correo.substring(indexArroba); // Todo desde el "@"

    const enmascarado = '*'.repeat(indexArroba - 2);

    return `${primerosDos}${enmascarado}${dominio}`;
  }
  */

  enmascararCorreo(correo: string): string {
    const indexArroba = correo.indexOf('@');
    if (indexArroba === -1) {
      return correo; // Retorna el correo sin cambios si no hay "@"
    }
  
    const primerosDos = correo.substring(0, 2); // Primeras dos letras del nombre de usuario
    const enmascaradoNombre = '*'.repeat(indexArroba - 2); // Enmascarar el resto del nombre de usuario
  
    // Construir la parte visible del dominio
    const dominioVisible = correo.substring(indexArroba + 1); // Parte después del "@"
    
    // Enmascarar los primeros 4 caracteres del dominio después del "@" y dejar el resto
    const dominioEnmascarado = '****' + dominioVisible.substring(4);
  
    return ` ${primerosDos}${enmascaradoNombre}@${dominioEnmascarado}`;
  }


}
