import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SpeciesService ,Species } from 'src/app/services/species.service';

@Component({
  selector: 'app-hunt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title class="text-xl font-bold mb-4">Add Hunt</h2>
      <form [formGroup]="huntForm" (ngSubmit)="onSubmit()">
        <div mat-dialog-content>
          <mat-form-field class="w-full">
            <mat-label>Species</mat-label>
            <mat-select formControlName="speciesId" required>
              <mat-option *ngFor="let species of speciesList" [value]="species.id">
                {{ species.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="huntForm.get('speciesId')?.hasError('required')">
              Species is required
            </mat-error>
          </mat-form-field>
          <mat-form-field class="w-full">
            <mat-label>Weight (kg)</mat-label>
            <input matInput type="number" formControlName="weight" required step="0.1">
            <mat-error *ngIf="huntForm.get('weight')?.hasError('required')">
              Weight is required
            </mat-error>
            <mat-error *ngIf="huntForm.get('weight')?.hasError('min')">
              Weight must be greater than 0
            </mat-error>
          </mat-form-field>
        </div>
        <div mat-dialog-actions class="flex justify-end gap-2 mt-4">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!huntForm.valid">
            Add Hunt
          </button>
        </div>
      </form>
    </div>
  `
})
export class HuntDialogComponent implements OnInit {
  huntForm: FormGroup;
  speciesList: Species[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HuntDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { participationId: string, speciesId: string },
    private speciesService: SpeciesService
  ) {
    this.huntForm = this.fb.group({
      speciesId: [data.speciesId || '', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]]
    });
  }

  ngOnInit(): void {
    this.speciesService.getSpecies().subscribe({
      next: (species) => {
        this.speciesList = species;
      },
      error: (error) => {
        console.error('Error fetching species:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.huntForm.valid) {
      const huntData = {
        participationId: this.data.participationId,
        speciesId: this.huntForm.get('speciesId')?.value,
        weight: this.huntForm.get('weight')?.value
      };
      this.dialogRef.close(huntData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
