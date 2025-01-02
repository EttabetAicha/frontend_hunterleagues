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
import { ParticipationService } from '../../../services/Participation.service';

interface ParticipationResponse {
  id: string;
  username: string;
  code: string;
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
    MatDialogModule
  ],
  templateUrl: './participation.component.html',
})
export class ParticipationComponent implements OnInit {
  displayedColumns: string[] = ['username', 'code', 'actions'];
  dataSource: ParticipationResponse[] = [];
  isLoading = true;

  constructor(
    private participationService: ParticipationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Since we don't have a getAll endpoint, we might want to
    // load specific competition results or show a message
    this.isLoading = false;
  }

  // Method to load results for a specific competition and user
  loadCompetitionResults(userId: string, competitionId: string): void {
    this.isLoading = true;
    this.participationService.getCompetitionResults(userId, competitionId).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load competition results:', error);
        this.isLoading = false;
      }
    });
  }

  // Method to load podium results
  loadPodiumResults(competitionId: string): void {
    this.isLoading = true;
    this.participationService.getCompetitionPodium(competitionId).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load podium results:', error);
        this.isLoading = false;
      }
    });
  }

  registerParticipation(userId: string, competitionId: string): void {
    this.participationService.registerParticipation({ userId, competitionId }).subscribe({
      next: (response) => {
        // Handle successful registration
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Failed to register participation:', error);
      }
    });
  }
}
