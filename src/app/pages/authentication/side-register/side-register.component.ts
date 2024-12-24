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
import { RegisterService } from './RegisterService.service';

interface RegisterRequest {
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  nationality: string;
}

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {}

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    cin: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    nationality: new FormControl('', [Validators.required]),
    role: new FormControl('ADMIN', [Validators.required]),
  });

  get f() {
    return this.registerForm.controls;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.replace('_', ' ')} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      if (controlName === 'username') {
        return 'Username must be at least 6 characters';
      }
      if (controlName === 'password') {
        return 'Password must be at least 8 characters';
      }
    }
    if (control?.hasError('serverError')) {
      return control.getError('serverError');
    }
    return '';
  }

  submit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value as RegisterRequest;

      this.registerService.register(formData).subscribe({
        next: () => {
          // Handle successful registration
          this.router.navigate(['/authentication/login']);
        },
        error: (error) => {
          if (error?.error?.message) {
            // Handle specific field errors if the API provides them
            const fieldName = error.error.field || 'username';
            this.registerForm.get(fieldName)?.setErrors({
              serverError: error.error.message,
            });
          }
        },
      });
    } else {
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
