import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-password-success',
  standalone:true,
  templateUrl: './password-success.component.html',
  styleUrls: ['./password-success.component.scss'],
  imports: [
    InputTextModule,
    ProgressSpinnerModule,
    CommonModule
  ]
})
export class PasswordSuccessComponent implements OnInit {
  user: string = '';
  page: string = '';
  emp: string='860090915';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', window.location.href);
    });
  
    this.route.paramMap.subscribe(params => {
      const UserName: string = params.get('userName') ?? '';
      const page: string = params.get('page') ?? 'OFV';
      const emp: string = params.get('emp') ?? '860090915'; // `emp` con valor por defecto
  
      this.user = UserName;
      this.page = page;
      this.emp = emp;
  
      setTimeout(() => {
        this.loading = false;
      }, 1000); 
    });
  }
  
  
  redirectToPasswordReset() {
    if (this.page === 'BMX') {
      window.location.href = 'http://apps.activos.com.co/JADM0017/outside/login.xhtml';
    } else {
      // Concatenar el parámetro `emp` a la URL
      const url = `https://apps.genialw.com/clientes-oficina-virtual/#/app-inicio/NI/${this.emp}`;
      window.location.href = url;
    }
  }
  
}
