import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hunt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add Hunt</h2>
    <form [formGroup]="huntForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field class="full-width">
          <mat-label>Weight</mat-label>
          <input matInput type="number" formControlName="weight" required>
          <mat-error *ngIf="huntForm.get('weight')?.hasError('required')">
            Weight is required
          </mat-error>
          <mat-error *ngIf="huntForm.get('weight')?.hasError('min')">
            Weight must be greater than 0
          </mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!huntForm.valid">
          Add Hunt
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class HuntDialogComponent {
  huntForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HuntDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { participationId: string, speciesId: string }
  ) {
    this.huntForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.huntForm.valid) {
      const huntData = {
        participationId: this.data.participationId,
        speciesId: this.data.speciesId,
        weight: this.huntForm.get('weight')?.value
      };
      this.dialogRef.close(huntData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
