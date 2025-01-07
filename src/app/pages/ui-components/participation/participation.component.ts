import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ParticipationService } from '../../../services/Participation.service';
import { CompetitionService } from '../../../services/competition.service';
import { HuntService } from 'src/app/services/hunt.service';
import { HuntDialogComponent } from './HuntDialog.component';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

interface ParticipationData {
  id: string;
  userId: string;
  competitionId: string;
  username: string;
  code: string;
  results?: any[];
  score:DoubleRange
}

@Component({
  selector: 'app-participation',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container mx-4 my-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Participations</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="isLoading" class="flex justify-center my-4">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="errorMessage" class="text-red-600 my-2 p-4">
            {{ errorMessage }}
          </div>

          <table mat-table [dataSource]="dataSource" class="w-full" *ngIf="!isLoading">
            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef>Participant</th>
              <td mat-cell *matCellDef="let element">{{ element.username }}</td>
            </ng-container>

            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Competition</th>
              <td mat-cell *matCellDef="let element">{{ element.code }}</td>
            </ng-container>
            <ng-container matColumnDef="score">
              <th mat-header-cell *matHeaderCellDef>Score</th>
              <td mat-cell *matCellDef="let element">{{ element.score }}</td>
            </ng-container>


            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button
                  mat-icon-button
                  (click)="openHuntDialog(element)"
                  [disabled]="!element.id">
                  <mat-icon>add_circle</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="!isLoading && dataSource.length === 0" class="p-4 text-center">
            No participations found.
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      margin: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 80px;
      text-align: center;
    }
  `]
})
export class ParticipationComponent implements OnInit {
  displayedColumns: string[] = ['username', 'code','score', 'actions'];
  dataSource: any[] = [];
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private participationService: ParticipationService,
    private competitionService: CompetitionService,
    private dialog: MatDialog,
    private huntService: HuntService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadParticipations();
  }

  loadParticipations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.participationService.getAllParticipations().pipe(
      map(participations => participations.map(participation => {
        return forkJoin({
          participation: of(participation),
          results: this.participationService.getCompetitionResults(participation.userId, participation.competitionId).pipe(
            catchError(() => of([]))
          )
        });
      })),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (observables) => {
        forkJoin(observables).subscribe({
          next: (results) => {
            this.dataSource = results.map(result => ({
              id: result.participation.id,
              username: result.participation.username,
              code: result.participation.code,
              score:result.participation.score

            }));
            console.log(this.dataSource)
          },

          error: (error) => {
            console.error('Error loading details:', error);
            this.errorMessage = 'Error loading participation details';
          }
        });
      },
      error: (error) => {
        console.error('Failed to load participations:', error);
        this.errorMessage = 'Failed to load participations';
        this.dataSource = [];
      }
    });
  }

  openHuntDialog(participation: ParticipationData): void {
    const speciesId = participation.results?.[0]?.speciesId || 'you must enter the species id';
    const dialogRef = this.dialog.open(HuntDialogComponent, {
      width: '400px',
      data: {
        participationId: participation.id,
        speciesId: speciesId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.registerHunt(result);
      }
    });
  }

  private registerHunt(huntData: any): void {
    this.huntService.registerHunt(huntData).subscribe({
      next: () => {
        this.showSnackBar('Hunt registered successfully!', 'success');
        this.loadParticipations();
      },
      error: (error) => {
        console.error('Error registering hunt:', error);
        this.showSnackBar('Failed to register hunt', 'error');
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['bg-green-500'] : ['bg-red-500']
    });
  }
}
