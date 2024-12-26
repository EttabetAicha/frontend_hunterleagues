import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user-service.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Custom password validator
function passwordStrengthValidator(): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !valid ? { passwordStrength: true } : null;
  };
}

// Future date validator
function futureDateValidator(): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();

    if (selectedDate <= today) {
      return { futureDate: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './addUser-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AddUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cin: ['', Validators.required],
      nationality: ['', Validators.required],
      role: ['MEMBER', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator()
      ]],
      licenseExpirationDate: ['', [Validators.required, futureDateValidator()]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
    
      const userData = { ...this.userForm.value };

      // Format the date to ISO string if it exists
      if (userData.licenseExpirationDate) {
        userData.licenseExpirationDate = new Date(userData.licenseExpirationDate)
          .toISOString();
      }

      this.userService.addUser(userData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to add user', error);
          // You might want to show an error message to the user here
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
