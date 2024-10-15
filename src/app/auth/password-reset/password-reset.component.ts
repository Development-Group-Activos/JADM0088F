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
  requestUrl: string = environment.baseUrl+'validate-request/';

  RCS_ID: string ='';
  property : string = 'mail';
  successMessage: string | null = null;
  
  alertType: string = '';
  alertMessage: string = '';
  showAlert: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.user) {
      this.messageService.add({
        key: 'resetPasswordToast',
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar usuario'
      });
      return;
    }

     this.displayDialog = true;

    //Encuentra el email para validar si existe

    this.authService.findEmail(this.user, this.property).subscribe(
      (response1) => {
        if (response1) {
          //retrasa el tiempo en que aparece el adialog
          setTimeout(() => {
            this.displayDialog = false;
          }, 3000); // 4000 ms = 4 segundos
        
          this.mail_envio = response1;
          this.authService.requestPasswordReset(this.user).subscribe(
            (response) => {
              setTimeout(() => {
                this.displayDialog = false;
              }, 4000);
              this.RCS_ID = response;
              //console.log(this.requestUrl + this.RCS_ID);
             // console.log('RequesId : ',this.mail_envio, this.user, this.requestUrl + this.RCS_ID+'/'+this.user);

              this.authService.sendResetEmail(this.mail_envio, this.user, this.requestUrl + this.RCS_ID+'/'+this.user).subscribe(
                resp => {
                  if (resp) {
                    console.log('SendEmail :');
                  } else {
                    console.log('No llego SendEmail');
                  }
                },
                (error) => {
                  // Manejo de errores para sendResetEmail
                  console.log('Errores al enviar el correo:',error);
                  this.messageService.add({
                    key: 'resetPasswordToast',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo enviar el correo de restablecimiento de contraseña.'
                  });
                }
              );

              if (response) {
                //console.log('Respuesta', response);      
                this.alertType = 'warning';
                this.alertMessage = `Se ha enviado la solicitud a ${this.enmascararCorreo(this.mail_envio)}`;
                this.showAlert = true;

                // Opcionalmente, ocultar la alerta después de un tiempo
                setTimeout(() => {
                  this.showAlert = false;
                }, 10000); // 10 segundos
              } else {
                this.messageService.add({
                  key: 'resetPasswordToast',
                  severity: 'error',
                  summary: 'Error',
                  detail: 'El nombre de usuario no existe.'
                });
              }
            },
            (error) => {
              // Manejo de errores para requestPasswordReset
              console.log('Errores', error);
              this.displayDialog = false;
              this.messageService.add({
                key: 'resetPasswordToast',
                severity: 'error',
                summary: 'Error',
                detail: 'Error al procesar la solicitud.'
              });
            }
          );
        } else {
          //console.log('No encontró el correo');
          this.messageService.add({
            key: 'resetPasswordToast',
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre de usuario no existe.'
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
          detail: 'El nombre de usuario no existe.'
        });
      }
    );

  }

  navigateToLogin() {
    this.router.navigate(['/login']);  //cambiar la ruta para que redirija al login de la jadm0017
  }

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


}
