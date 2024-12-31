import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CompetitionService } from '../../../services/competition.service';

@Component({
  selector: 'app-add-competition-dialog',
  template: `
    <h2 mat-dialog-title>Create Competition</h2>
    <form [formGroup]="competitionForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field class="w-100">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code">
          <mat-error *ngIf="competitionForm.get('code')?.hasError('required')">
            Code is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location">
          <mat-error *ngIf="competitionForm.get('location')?.hasError('required')">
            Location is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Date</mat-label>
          <input matInput formControlName="date" type="datetime-local">
          <mat-error *ngIf="competitionForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Species Type</mat-label>
          <mat-select formControlName="speciesType">
            <mat-option value="SEA">Sea</mat-option>
            <mat-option value="BIG_GAME">Big game</mat-option>
            <mat-option value="BIRD">Bird</mat-option>
          </mat-select>
          <mat-error *ngIf="competitionForm.get('speciesType')?.hasError('required')">
            Species Type is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Min Participants</mat-label>
          <input matInput formControlName="minParticipants" type="number">
          <mat-error *ngIf="competitionForm.get('minParticipants')?.hasError('required')">
            Min Participants is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Max Participants</mat-label>
          <input matInput formControlName="maxParticipants" type="number">
          <mat-error *ngIf="competitionForm.get('maxParticipants')?.hasError('required')">
            Max Participants is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Open Registration</mat-label>
          <mat-select formControlName="openRegistration">
            <mat-option [value]="true">Yes</mat-option>
            <mat-option [value]="false">No</mat-option>
          </mat-select>
          <mat-error *ngIf="competitionForm.get('openRegistration')?.hasError('required')">
            Open Registration is required
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!competitionForm.valid">
          Create
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
    MatDialogModule
  ],
})
export class AddCompetitionDialogComponent {
  competitionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    public dialogRef: MatDialogRef<AddCompetitionDialogComponent>
  ) {
    this.competitionForm = this.fb.group({
      code: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator()]],
      speciesType: ['', Validators.required],
      minParticipants: ['', Validators.required],
      maxParticipants: ['', Validators.required],
      openRegistration: ['', Validators.required]
    });
  }
  futureDateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only the date part

      return selectedDate <= today ? { futureDate: true } : null;
    };
  }

  onSubmit(): void {
    if (this.competitionForm.valid) {
      const competitionData = { ...this.competitionForm.value };
      competitionData.date = new Date(competitionData.date).toISOString(); // Convert to ISO string

      this.competitionService.addCompetition(competitionData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to create competition', error);
        }
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
