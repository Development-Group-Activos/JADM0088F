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
  page: string = 'OFV'; // Por defecto será 'OFV'
  emp: string = '860090915';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const requestId: string = params.get('requestId') ?? '';
      const pageParam: string | null = params.get('page'); 
      const empParam: string | null = params.get('empParam'); // Nuevo parámetro
  
      // Si no se recibe `empParam`, se asigna un valor predeterminado
      this.page = pageParam ?? 'OFV';
      this.RequestID = requestId;
      this.emp = empParam ?? '860090915'; // Valor predeterminado para `emp`
  
      //console.log('Request ID:', requestId);

     // console.log('Page:', this.page);
      sessionStorage.setItem('RequestID', this.RequestID);
      sessionStorage.setItem('page', this.page);
      sessionStorage.setItem('emp', this.emp);

  
      // Valida la solicitud si los parámetros son válidos
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
          console.log('Solicitud Exitosa:', this.RequestID, this.page, this.emp);
          
          this.authService.searchUser(this.RequestID).subscribe(
            (userName) => {
              if (userName) {
                this.user = userName; // Guardamos el usuario obtenido
            //    console.log('Nombre de usuario:', this.user);
                sessionStorage.setItem('user', this.user);
                sessionStorage.setItem('RequestID', this.RequestID);
                sessionStorage.setItem('page', this.page);
                sessionStorage.setItem('emp', this.emp);
          
                this.router.navigate(['/change-password'], {
                  state: {
                    user: this.user,
                    RequestID: this.RequestID,
                    page: this.page, 
                    emp: this.emp
                  }
                });
              } else {
                console.error('Error: No se pudo obtener el usuario.');
              }
            },
            (error) => {
              console.error('Error al buscar el usuario:', error);
            }
          );
        } else {
          console.log('Solicitud No Exitosa');
          this.router.navigate(['/expired-request']);
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error en la validación:', error);
        this.router.navigate(['/expired-request']);
      }
    );
  }
}