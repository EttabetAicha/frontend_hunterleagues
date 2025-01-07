import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CompetitionService } from '../../../services/competition.service';

@Component({
  selector: 'app-add-competition-dialog',
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Create New Competition</h2>

      <form [formGroup]="competitionForm" (ngSubmit)="onSubmit()" class="competition-form">
        <div class="form-content">
          <div class="form-grid">
            <!-- Code Field -->
            <div class="form-field">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Competition Code</mat-label>
                <input matInput formControlName="code" maxlength="20"
                       placeholder="Enter unique code" class="custom-input">
                <mat-hint align="end" class="hint-text">
                  {{competitionForm.get('code')?.value?.length || 0}}/20
                </mat-hint>
              </mat-form-field>
            </div>

            <!-- Location Field -->
            <div class="form-field">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Location</mat-label>
                <input matInput formControlName="location"
                       placeholder="Where will it be held?" class="custom-input">
              </mat-form-field>
            </div>

            <!-- Date Field -->
            <div class="form-field">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Event Date & Time</mat-label>
                <input matInput formControlName="date" type="datetime-local"
                       [min]="minDate" class="custom-input">
                <mat-hint class="hint-text">Must be a future date</mat-hint>
              </mat-form-field>
            </div>

            <!-- Species Type Field -->
            <div class="form-field">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Competition Type</mat-label>
                <mat-select formControlName="speciesType" class="custom-select">
                  <mat-option *ngFor="let type of speciesTypes" [value]="type.value"
                             class="custom-option">
                    <div class="option-content">
                      <span class="option-icon">{{type.icon}}</span>
                      <span>{{type.label}}</span>
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Participants Range Fields -->
            <div class="participants-container">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Minimum Participants</mat-label>
                <input matInput type="number" formControlName="minParticipants"
                       min="1" class="custom-input">
              </mat-form-field>

              <div class="separator">to</div>

              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Maximum Participants</mat-label>
                <input matInput type="number" formControlName="maxParticipants"
                       [min]="minParticipantsValue + 1" class="custom-input">
              </mat-form-field>
            </div>

            <!-- Registration Type Field -->
            <div class="form-field">
              <mat-form-field appearance="outline" class="custom-form-field">
                <mat-label>Registration Type</mat-label>
                <mat-select formControlName="openRegistration" class="custom-select">
                  <mat-option [value]="true" class="custom-option">
                    <div class="option-content">
                      <span class="option-icon">🌐</span>
                      <span>Open Registration</span>
                    </div>
                  </mat-option>
                  <mat-option [value]="false" class="custom-option">
                    <div class="option-content">
                      <span class="option-icon">🎯</span>
                      <span>Invitation Only</span>
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-button type="button" class="cancel-button"
                  [disabled]="isSubmitting" (click)="onCancel()">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit"
                  class="submit-button" [disabled]="!competitionForm.valid || isSubmitting">
            <span *ngIf="!isSubmitting">Create Competition</span>
            <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      /* padding: 12px; */
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
    }

    .dialog-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a2b3c;
      margin-bottom: 12px;
      text-align: center;
    }

    .competition-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-content {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .form-field {
      width: 100%;
    }

    .custom-form-field {
      width: 100%;
    }

    .custom-form-field ::ng-deep .mat-form-field-wrapper {
      margin: 0;
      padding: 0;
    }

    .custom-form-field ::ng-deep .mat-form-field-outline {
      background: #ffffff;
      border-radius: 8px;
    }

    .custom-input {
      height: 48px;
      font-size: 16px;
    }

    .custom-select {
      font-size: 16px;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }

    .option-icon {
      font-size: 20px;
    }

    .participants-container {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: center;
    }

    .separator {
      color: #64748b;
      font-weight: 500;
    }

    .hint-text {
      color: #64748b;
      font-size: 12px;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .cancel-button {
      color: #64748b;
    }

    .submit-button {
      min-width: 160px;
      height: 48px;
      font-weight: 500;
    }

    .submit-button:disabled {
      background-color: #94a3b8;
    }

    mat-spinner {
      margin: 0 auto;
    }

    @media (max-width: 600px) {
      .dialog-container {
        padding: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .participants-container {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .separator {
        display: none;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
})
export class AddCompetitionDialogComponent implements OnInit {
  competitionForm: FormGroup;
  isSubmitting = false;
  minDate: string;
  speciesTypes = [
    { value: 'SEA', label: 'Sea Fishing', icon: '🎣' },
    { value: 'BIG_GAME', label: 'Big Game Hunting', icon: '🎯' },
    { value: 'BIRD', label: 'Bird Hunting', icon: '🦅' }
  ];

  get minParticipantsValue(): number {
    return this.competitionForm.get('minParticipants')?.value || 1;
  }

  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddCompetitionDialogComponent>
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.competitionForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      location: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator()]],
      speciesType: ['', Validators.required],
      minParticipants: ['', [Validators.required, Validators.min(1)]],
      maxParticipants: ['', [Validators.required]],
      openRegistration: [true, Validators.required]
    }, { validators: this.participantsValidator });
  }

  ngOnInit(): void {
    this.competitionForm.get('minParticipants')?.valueChanges.subscribe(() => {
      this.competitionForm.get('maxParticipants')?.updateValueAndValidity();
    });
  }

  participantsValidator(group: FormGroup): { [key: string]: any } | null {
    const min = group.get('minParticipants')?.value;
    const max = group.get('maxParticipants')?.value;
    return min && max && max <= min ? { minValue: true } : null;
  }

  futureDateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today ? { futureDate: true } : null;
    };
  }

  onSubmit(): void {
    if (this.competitionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const competitionData = { ...this.competitionForm.value };
      competitionData.date = new Date(competitionData.date).toISOString();

      this.competitionService.addCompetition(competitionData).subscribe({
        next: () => {
          this.snackBar.open('Competition created successfully! 🎉', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to create competition. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Failed to create competition', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
