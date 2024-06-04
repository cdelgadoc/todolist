import { Injectable } from '@angular/core';
import { LOGIN_API_URL } from '../app.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { StateService } from './state.service';

export const TOKEN = 'token'
export const AUTHENTICATED_USER = 'authenticaterUser'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private errorMessage = "";

  constructor(private http: HttpClient, private stateService: StateService) { }

  
  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(LOGIN_API_URL, body.toString(), options).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          return null;
        }
      ),
      catchError(error => {
        return crearObservableMensajeCodigo(error.statusText, error.status);
      })
    );
  }

  


  /*

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(LOGIN_API_URL, body.toString(), options).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          return data;
        }
      ),
      catchError(error => {
          console.error('Error occurred:', error);
          return "of(null)";
      })
    );
  } */
  


  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER)
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN)
    }
    return null
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(AUTHENTICATED_USER)
    return !(user === null)
  }

  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER)
    sessionStorage.removeItem(TOKEN)
  }

}

export class AuthenticationBean {
  constructor(public message: string) { }
}

function crearObservableMensajeCodigo(mensaje: string, codigo: number): Observable<{ mensaje: string, codigo: number }> {
  return new Observable<{ mensaje: string, codigo: number }>(subscriber => {
    subscriber.next({ mensaje, codigo });
    subscriber.complete();
  });
}