import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-expired-request',
  standalone:true,
  templateUrl: './expired-request.component.html',
  styleUrls: ['./expired-request.component.scss'],
  imports:[DialogModule,ButtonModule]
})
export class ExpiredRequestComponent {
  display: boolean = true;

  constructor(private router: Router) {}

  showDialog() {
    this.display = true;
  }

  redirectToLogin() {
    this.router.navigate(['/password-reset']);   //cambiar la ruta para que redirija al login de la jadm0017
  }
}
