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
import { SpeciesService } from '../../../services/species.service';



@Component({
  selector: 'app-species',
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
    MatDialogModule
  ],
  template: `
    <mat-card class="cardWithShadow">
      <mat-card-content>
        <mat-card-title>Species List</mat-card-title>

        @if (!isLoading) {
          <div class="table-responsive">
            <table mat-table [dataSource]="dataSource" class="w-100">
              <ng-container matColumnDef="info">
                <th mat-header-cell *matHeaderCellDef class="f-w-600 mat-subtitle-1 f-s-14 p-l-0">
                  Species Info
                </th>
                <td mat-cell *matCellDef="let element" class="p-l-0">
                  <div class="d-flex align-items-center">
                    <div class="m-l-16">
                      <h6 class="mat-subtitle-1 f-s-14 f-w-600">{{ element.name }}</h6>
                      <span class="f-s-14">Category: {{ element.category }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="details">
                <th mat-header-cell *matHeaderCellDef class="f-w-600 mat-subtitle-1 f-s-14">
                  Details
                </th>
                <td mat-cell *matCellDef="let element" class="p-l-0">
                  <h6 class="mat-subtitle-1 f-s-14 f-w-600">Points: {{ element.points }}</h6>
                  <span class="f-s-14">Min Weight: {{ element.minimumWeight }}kg</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="difficulty">
                <th mat-header-cell *matHeaderCellDef class="f-w-600 mat-subtitle-1 f-s-14">
                  Difficulty
                </th>
                <td mat-cell *matCellDef="let element" class="p-l-0">
                  <span [ngClass]="{
                    'bg-light-success text-success': element.difficulty === 'EASY',
                    'bg-light-warning text-warning': element.difficulty === 'MEDIUM',
                    'bg-light-error text-error': element.difficulty === 'HARD'
                  }" class="role-badge f-w-600 p-6 p-y-4 f-s-12">
                    {{ element.difficulty }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="f-w-600 mat-subtitle-1 f-s-14">
                  Actions
                </th>
                <td mat-cell *matCellDef="let element" class="p-l-0">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="deleteSpecies(element.id)">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        } @else {
          <div class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class SpeciesComponent implements OnInit {
  displayedColumns: string[] = ['info', 'details', 'difficulty', 'actions'];
  dataSource: any[] = [];
  isLoading = true;

  constructor(
    private speciesService: SpeciesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSpecies();
  }

  loadSpecies(): void {
    this.speciesService.getSpecies().subscribe({

      next: (data) => {
        this.dataSource = data.map(data =>({
          id: data.id,
          name: data.name,
          category: data.category,
          points: data.points,
          minimumWeight: data.minimumWeight,
          difficulty: data.difficulty
        }));
        this.isLoading = false;
        console.log(data);
      },
      error: (error) => {
        console.error('Failed to load species:', error);
        this.isLoading = false;
      }
    });
  }

  deleteSpecies(id: string): void {
    this.speciesService.deleteSpecies(id).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(species => species.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete species:', error);
      }
    });
  }
}
