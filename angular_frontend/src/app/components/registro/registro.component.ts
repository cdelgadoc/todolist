import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { StateService } from 'src/app/services/state.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  errorMessage = '';
  errorRegister = false;
  
  successMessage = 'El usuario ha sido registrado exitosamente!';
  successRegister = false;

  registerForm: FormGroup;

  constructor(
    private registerService: RegisterService,
    private stateService: StateService,
    private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.registerForm.patchValue({ avatar: file });
  }
  
  createUser() {
    this.registerService.createUser(
      this.username?.value, 
      this.password?.value, 
      this.stateService.getImageBase64String()).subscribe(
      (response) => {
        console.log('Response: ' + response);
        this.handleSuccessResponse();
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        this.handleError(error);
      }
    );
  }
  
  private handleSuccessResponse() {
    this.errorRegister = false;
    this.successRegister = true;
    of(null).pipe(delay(1000)).subscribe(() => {
      this.clearFields();
      window.location.reload();
    });
  }
  
  private handleError(error: any) {
    this.errorRegister = true;
    this.successRegister = false;
    if (error.status === 400) {
      this.errorMessage = 'El usuario ya existe.';
    } else if (error.status === 500) {
      this.errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
    } else {
      this.errorMessage = 'Se ha producido un error en el sistema.';
    }
  }
  
  clearFields() {
    this.registerForm.reset({
      username: '',
      password: ''
    });

    this.stateService.setImageBase64String('');
    this.clearFile();
  }

  clearFile() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
      if (input) {
        input.value = ''; 
      }
  }
  
}

