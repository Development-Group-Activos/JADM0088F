import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private encryptionKey = 'JADM0088SECRETKY';

  constructor(private http: HttpClient) {
    const host = window.location.protocol;
    this.apiUrl = host.startsWith('https')
      ? `${host}${environment.baseUrl}`
      : `${host}${environment.baseUrlIntranet}`; 
  }

//  Método para encriptar los datos 
    private encryptData(data: string): string {
      const key = CryptoJS.enc.Utf8.parse(this.encryptionKey);
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();  
    }

  // Solicitud de restablecimiento de contraseña - OK
 /* requestPasswordReset(username: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/request?username=${username}`;
    //console.log('URL de la API:', url);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('username', username);

    return this.http.post(url, {}, { headers, params, responseType: 'text' });
  }*/

  requestPasswordReset(username: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/request`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Encriptar username antes de enviarlo
    const encryptedUserName = this.encryptData(username);
  
    // Construcción del cuerpo de la petición
    const body = { userName: encryptedUserName };
  
    return this.http.post(url, body, { headers, responseType: 'text' });
  }

  // Validar una solicitud de restablecimiento de contraseña - OK
  validateRequest(requestId: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/validate/${requestId}`;
    
    //console.log('URL de la API:', url);
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.get(url, { headers, responseType: 'text' });
  }

  // edite aqui: Nuevo servicio para obtener el usuario por requestId
  searchUser(requestId: string): Observable<string> {
    const url = `${this.apiUrl}/restablecer-password/find-user/${requestId}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }

  // Obtener el correo del usuario - OK 
  findEmail(userName: string, property: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/find-email`; // URL sin los parámetros
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Encriptar el userName antes de enviarlo
    const encryptedUserName = this.encryptData(userName);

    const params = new HttpParams()
      .set('userName', encryptedUserName)
      .set('property', property);

    return this.http.get(url, { headers, params, responseType: 'text' });
  }

 // Obtener el dominio del usuario
  obtenerDominio(userName: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/dominio/${userName}`;
    return this.http.get(url, { responseType: 'text' });
  }

  // Enviar correo de restablecimiento de contraseña - OK
  sendResetEmail(userEmail: string, userName: string, requestUrl: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/send-email`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Encriptar el userName antes de enviarlo
    const encryptedUserName = this.encryptData(userName);

    // Construir los parámetros de la consulta
    const params = new HttpParams()
      .set('userEmail', userEmail)
      .set('userName', encryptedUserName)
      .set('requestUrl', requestUrl);

    return this.http.post(url, {}, { headers, params ,responseType: 'text' });
  }

  // Actualizar la contraseña del usuario - OK
  
  updatePassword(userName: string, newPassword: string, requestId: string, domain: string): Observable<any> {
    const url = `${this.apiUrl}/restablecer-password/update`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
      // Encriptamos los datos
      const encryptedUserName = this.encryptData(userName);
      const encryptedPassword = this.encryptData(newPassword);
  
      const body = {
        userName: encryptedUserName,  // Enviado encriptado
        newPassword: encryptedPassword,  // Enviado encriptado
        requestId: requestId,
        domain: domain
      };
  
    //  console.log('Enviando datos:', body);
  
      return this.http.put(url, body, { headers, responseType: 'text' });
    }

/*
updatePassword(userName: string, newPassword: string, ramaLdap: string): Observable<any> {
  const url = this.apiUrlBase2; // Nuevo servicio para actualizar contraseña

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Construimos el cuerpo de la solicitud con los parámetros requeridos
  const body = {
    userName: userName,
    previousPass: null,
    newPass: newPassword,
    ramaLdap: ramaLdap,
    admin: true
  };

  return this.http.post(url, body, { headers, responseType: 'text' });
}
 */ 
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

}
