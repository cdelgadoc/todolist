import { Injectable } from '@angular/core';
import { USER_API_URL } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  createUser(usernameInput: string, passwordInput: string, avatarInput: string | undefined): Observable<any> {
    const userDTO: any = {
      username: usernameInput,
      password: passwordInput
    };

    if (avatarInput !== null && avatarInput !== '') {
      userDTO.avatar = avatarInput;
    }
    
    return this.http.post<any>(USER_API_URL, userDTO, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

}
