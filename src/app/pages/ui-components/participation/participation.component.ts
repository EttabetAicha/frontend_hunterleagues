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
import { ParticipationService, ParticipationResponse } from '../../../services/Participation.service';
import { CompetitionService } from '../../../services/competition.service';
import { UserService } from 'src/app/services/user-service.service';
import { HuntService } from 'src/app/services/hunt.service';

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
  displayedColumns: string[] = ['userName', 'competitionName', 'actions'];
  dataSource: any[] = [];
  isLoading = true;
  errorMessage: string = '';


  constructor(
    private participationService: ParticipationService,
    private userService: UserService,
    private competitionService: CompetitionService,
    private dialog: MatDialog,
    private huntService: HuntService
  ) {}

  ngOnInit(): void {
    this.loadParticipations();
  }

  loadParticipations(): void {
    this.isLoading = true;
    this.participationService.getAllParticipations().subscribe({
      next: (participations) => {
        this.dataSource = participations.map(participation => {
          return {
            ...participation,
            userName: '',
            competitionName: ''
          };
        });
        this.loadAdditionalDetails();
      },
      error: (error) => {
        console.error('Failed to load participations:', error);
        this.isLoading = false;
      }
    });
  }

  loadAdditionalDetails(): void {
    this.dataSource.forEach(participation => {
      this.userService.getUserById(participation.userId).subscribe({
        next: (user) => {
          participation.username = `${user.firstName} ${user.lastName}`;
        },
        error: (error) => {
          console.error('Failed to load user details:', error);
        }
      });

      this.competitionService.getCompetitionById(participation.competitionId).subscribe({
        next: (competition) => {
          participation.competitionName = competition.code;
        },
        error: (error) => {
          console.error('Failed to load competition details:', error);
        }
      });
    });
    this.isLoading = false;

  }


  huntParticipation(userId: string, competitionId: string): void {
    if (!userId?.trim()) {
      this.errorMessage = 'User ID is required and cannot be empty.';
      return;
    }

    if (!competitionId?.trim()) {
      this.errorMessage = 'Competition ID is required and cannot be empty.';
      return;
    }


    const huntRequest = {
      participationId: userId.trim(),
      speciesId: competitionId.trim(),
      weight: 0
    };


    this.huntService.registerHunt(huntRequest).subscribe({
      next: (response) => {
        console.log('Hunt registered successfully:', response);
        this.errorMessage = '';

      },
      error: (err) => {
        console.error('Error registering hunt:', err);
        this.errorMessage = 'An error occurred while registering the hunt. Please try again.';
      
      }
    });
  }

}
