import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user-service.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Inject } from '@angular/core';

// Reuse existing validators
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
  selector: 'app-edit-user-dialog',
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field class="w-100">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName">
          <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
            First name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName">
          <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
            Last name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>CIN</mat-label>
          <input matInput formControlName="cin">
          <mat-error *ngIf="userForm.get('cin')?.hasError('required')">
            CIN is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Nationality</mat-label>
          <input matInput formControlName="nationality">
          <mat-error *ngIf="userForm.get('nationality')?.hasError('required')">
            Nationality is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="ADMIN">Admin</mat-option>
            <mat-option value="MEMBER">Member</mat-option>
            <mat-option value="JURY">Jury</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required')">
            Role is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>License Expiration Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="licenseExpirationDate">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="userForm.get('licenseExpirationDate')?.hasError('required')">
            License expiration date is required
          </mat-error>
          <mat-error *ngIf="userForm.get('licenseExpirationDate')?.hasError('futureDate')">
            Date must be in the future
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">
          Update
        </button>
      </div>
    </form>
  `,
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
export class EditUserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      cin: [data.cin, Validators.required],
      nationality: [data.nationality, Validators.required],
      role: [data.role, Validators.required],
      licenseExpirationDate: [new Date(data.licenseExpirationDate), [Validators.required, futureDateValidator()]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
      if (userData.licenseExpirationDate) {
        userData.licenseExpirationDate = new Date(userData.licenseExpirationDate)
          .toISOString();
      }

      this.userService.updateUser(this.data.id).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to update user', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
