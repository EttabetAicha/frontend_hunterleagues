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
import { SpeciesService } from 'src/app/services/species.service';
interface Species {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  points: number;
}

@Component({
  selector: 'app-edit-species-dialog',
  template: `
    <h2 mat-dialog-title>Edit Species</h2>
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
          <input matInput formControlName="category">
          <mat-error *ngIf="speciesForm.get('category')?.hasError('required')">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Difficulty</mat-label>
          <input matInput formControlName="difficulty">
          <mat-error *ngIf="speciesForm.get('difficulty')?.hasError('required')">
            Difficulty is required
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-100">
          <mat-label>Points</mat-label>
          <input matInput formControlName="points" type="number">
          <mat-error *ngIf="speciesForm.get('points')?.hasError('required')">
            Points are required
          </mat-error>
          <mat-error *ngIf="speciesForm.get('points')?.hasError('min')">
            Points must be a positive number
          </mat-error>
        </mat-form-field>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!speciesForm.valid">
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
export class EditSpeciesDialogComponent  {
  speciesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private speciesService: SpeciesService,
    public dialogRef: MatDialogRef<EditSpeciesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Species
  ) {}

  ngOnInit(): void {
    this.speciesForm = this.fb.group({
      name: [this.data.name, Validators.required],
      category: [this.data.category, Validators.required],
      difficulty: [this.data.difficulty, Validators.required],
      points: [this.data.points, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.speciesForm.valid) {
      const updatedSpecies = { ...this.data, ...this.speciesForm.value };
      this.speciesService.updateSpecies(updatedSpecies).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to update species', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
