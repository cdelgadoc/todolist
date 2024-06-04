import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  errorLogin = false;
  
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    public stateService: StateService) {
      this.loginForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(5)]]
      });
  }

  ngOnInit(): void {
    this.authenticationService.logout()
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.authenticationService.login(this.username?.value, this.password?.value)
      .subscribe((data) => {
        if (data === null) {
          this.router.navigate(['/menu']);
          this.errorLogin = false;
        } else {
          this.errorLogin = true;
          this.errorMessage = (data.codigo === 401) ? "Error al iniciar sesión." : "A ocurrido un error en el sistema.";
        }
      });
  }
  
}
