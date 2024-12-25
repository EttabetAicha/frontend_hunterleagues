import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../../services/loginService.service';

interface LoginResponse {
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  loginData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
    rememberDevice: new FormControl(false)
  });

  get f() {
    return this.loginData.controls;
  }

  submit() {
    if (this.loginData.valid) {
      const { email, password } = this.loginData.value;

      const loginRequest: LoginRequest = {
        email: email || '',
        password: password || ''
      };

      this.loginService.login(loginRequest).subscribe({
        next: (response: LoginResponse) => {
          if (response && response.token) {
            localStorage.setItem('auth-token', response.token);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          if (error?.error?.message) {
            this.loginData.get('username')?.setErrors({
              serverError: error.error.message
            });
          }
        }
      });
    } else {
      Object.keys(this.loginData.controls).forEach(key => {
        const control = this.loginData.get(key);
        control?.markAsTouched();
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginData.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return 'Username must be at least 6 characters';
    }
    if (control?.hasError('serverError')) {
      return control.getError('serverError');
    }
    return '';
  }
}
