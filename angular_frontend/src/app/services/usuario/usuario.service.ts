import { Injectable } from '@angular/core';
import { USER_API_URL } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  consultarUsuario(usernameInput: string | null): Observable<any> {
    return this.http.get<any>(USER_API_URL + usernameInput, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
