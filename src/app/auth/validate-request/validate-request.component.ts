import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validate-request',
  standalone:true,
  templateUrl: './validate-request.component.html',
  imports:[ProgressSpinnerModule,CommonModule]
})
export class ValidateRequestComponent implements OnInit {
  loading: boolean = true;
  user:string ='';
  RequestID:string ='';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const requestId: string = params.get('requestId') ?? '';

      const userName:string = params.get('userName') ??' ';

     // console.log(requestId);

     //  console.log('user',userName);

      this.RequestID =requestId;

      this.user=userName;

      if (requestId) {
        this.validateRequest(requestId);
      } else {
        this.loading = false;
      }
    });
  }

  validateRequest(requestId: string): void {
    this.authService.validateRequest(requestId).subscribe(
      (response: string) => {
        this.loading = false;

        if (response && response.includes('exitosa')) {
          const userInfo = this.user;
          const request = this.RequestID;

          if (userInfo && userInfo.length > 2) {
           // console.log(`Solicitud Exitosa para: ${userInfo} : ${request}`);
            sessionStorage.setItem('user', userInfo);
            sessionStorage.setItem('RequestID', request);

            this.router.navigate(['/change-password'], {
              state: {
                user: userInfo,
                RequestID: request
              }
          });
          } else {
          // console.log('Solicitud No Exitosa (Longitud insuficiente)');
            this.router.navigate(['/expired-request']);
          }
        } else {
          console.log('Solicitud No Exitosa)');
          this.router.navigate(['/expired-request']);
        }
      },
      (error) => {
        this.loading = false;
        //console.error('Error en la validación:', error);
        this.router.navigate(['/expired-request']);
      }
    );
  }
}
