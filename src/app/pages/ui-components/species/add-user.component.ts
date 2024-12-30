import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SpeciesService } from '../../../services/species.service';

@Component({
  selector: 'app-add-species-dialog',
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
  template: `
    <h2 mat-dialog-title>Create Species</h2>
    <form [formGroup]="speciesForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field class="w-100">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
          <mat-error *ngIf="speciesForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option value="SEA">Sea</mat-option>
            <mat-option value="BIG_GAME">Big gam</mat-option>
            <mat-option value="BIRD">Bird</mat-option>
          </mat-select>
          <mat-error *ngIf="speciesForm.get('category')?.hasError('required')">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Minimum Weight (kg)</mat-label>
          <input matInput type="number" formControlName="minimumWeight">
          <mat-error *ngIf="speciesForm.get('minimumWeight')?.hasError('required')">
            Minimum weight is required
          </mat-error>
          <mat-error *ngIf="speciesForm.get('minimumWeight')?.hasError('min')">
            Weight must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Difficulty</mat-label>
          <mat-select formControlName="difficulty">
            <mat-option value="COMMON">Common</mat-option>
            <mat-option value="RARE">Rare</mat-option>
            <mat-option value="LEGENDARY">Legendary</mat-option>
            <mat-option value="EPIC">Epic</mat-option>

          </mat-select>
          <mat-error *ngIf="speciesForm.get('difficulty')?.hasError('required')">
            Difficulty is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Points</mat-label>
          <input matInput type="number" formControlName="points">
          <mat-error *ngIf="speciesForm.get('points')?.hasError('required')">
            Points are required
          </mat-error>
          <mat-error *ngIf="speciesForm.get('points')?.hasError('min')">
            Points must be greater than 0
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit"
                [disabled]="!speciesForm.valid">
          Add
        </button>
      </div>
    </form>
  `
})
export class AddSpeciesDialogComponent {
  speciesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private speciesService: SpeciesService,
    public dialogRef: MatDialogRef<AddSpeciesDialogComponent>
  ) {
    this.speciesForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      minimumWeight: ['', [Validators.required, Validators.min(0)]],
      difficulty: ['MEDIUM', Validators.required],
      points: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.speciesForm.valid) {
      this.speciesService.addSpecies(this.speciesForm.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to add species', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
