import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mi-aplicacion';

  ngOnInit(): void {
    this.clearCookies();  // Se ejecuta al iniciar la app para limpiar cookies.
  }

  clearCookies(): void {
    //  Limpia todas las cookies disponibles en el dominio
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    }
  }
}