import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    const host = window.location.protocol;
    this.apiUrl = `${host}${environment.ApiUrlBase}`;
  }

  // Solicitud de restablecimiento de contraseña - OK
  requestPasswordReset(username: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/request?username=${username}`;
    //console.log('URL de la API:', url);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('username', username);

    return this.http.post(url, {}, { headers, params, responseType: 'text' });
  }

  // Validar una solicitud de restablecimiento de contraseña - OK
  validateRequest(requestId: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/validate/${requestId}`;
    console.log('URL de la API:', url);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('username', requestId);

    return this.http.get(url, { headers, params, responseType: 'text' });
  }

  // Obtener el correo del usuario - OK 
  findEmail(userName: string, property: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/find-email`; // URL sin los parámetros

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const params = new HttpParams()
      .set('userName', userName)
      .set('property', property);

    return this.http.get(url, { headers, params, responseType: 'text' });
  }


  // Enviar correo de restablecimiento de contraseña - OK
  sendResetEmail(userEmail: string, userName: string, requestUrl: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/send-email`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Construir los parámetros de la consulta
    const params = new HttpParams()
      .set('userEmail', userEmail)
      .set('userName', userName)
      .set('requestUrl', requestUrl);

    return this.http.post(url, {}, { headers, params ,responseType: 'text' });
  }

  // Actualizar la contraseña del usuario - OK
  updatePassword(userName: string, newPassword: string, requestId: string, domain: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/update?userName=${userName}&newPassword=${newPassword}&requestId=${requestId}&domain=${domain}`;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const params = new HttpParams()
      .set('userName', userName)
      .set('newPassword', newPassword)
      .set('requestId', requestId)
      .set('domain', domain);

    return this.http.put(url, {}, { headers , params , responseType: 'text' });
  }

  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

}
