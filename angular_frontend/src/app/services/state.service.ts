import { Injectable } from '@angular/core';
import { Tarea } from '../dto/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private imageBase64String: string = '';
  private tareaUpdate!: Tarea;
  private errorMessageLogin!: string;    
  
  getImageBase64String(): string {
    return this.imageBase64String;
  }

  setImageBase64String(value: string): void {
    this.imageBase64String = value;
  }

  getTareaUpdate(): Tarea {
    console.log("getTareaUpdate")
    console.log(this.tareaUpdate)
    return this.tareaUpdate;
  }

  setTareaUpdate(value: Tarea) {
    console.log("setTareaUpdate")
    console.log(value)
    this.tareaUpdate = value;
  }

  getErrorMessageLogin(): string {
    return this.errorMessageLogin;
  }

  setErrorMessageLogin(value: string): void {
    this.errorMessageLogin = value;
  }

}
