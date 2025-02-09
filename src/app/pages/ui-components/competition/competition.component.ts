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
import { CompetitionService } from '../../../services/competition.service';
import { AddCompetitionDialogComponent } from './add-competition-dialog.component';
import { ParticipationService } from 'src/app/services/Participation.service';
import { LoginService } from 'src/app/services/loginService.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PodiumDialogComponent } from './PodiumDialogComponent.component';
// import { EditCompetitionDialogComponent } from './edit-competition-dialog/edit-competition-dialog.component';


interface Competition {
  id: string;
  code: string;
  location: string;
  date: string;
  speciesType: string;
  minParticipants: number;
  maxParticipants: number;
  openRegistration: boolean;
}

@Component({
  selector: 'app-competition',
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
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']

})
export class CompetitionComponent implements OnInit {
  displayedColumns: string[] = ['rowNumber', 'location', 'date', 'speciesType', 'minParticipants', 'maxParticipants', 'openRegistration', 'actions'];
  dataSource: Competition[] = [];
  isLoading = true;
  podiumData: any[] = [];

  constructor(
    private competitionService: CompetitionService,
    private participationService:ParticipationService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.competitionService.getCompetitions().subscribe({
      next: (data) => {
        this.dataSource = data.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load competitions:', error);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCompetitionDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompetitions();
      }
    });
  }
  participate(competitionId: string): void {
    const userInfo = this.loginService.getUserInfoFromToken();
    console.log(userInfo);
    if (userInfo && userInfo.sub) {
      const userId = userInfo.userId;
      console.log(userId);
      this.participationService.isUserRegistered(userId, competitionId).subscribe({
        next: (isRegistered) => {
          console.log('Is user registered:', isRegistered);
          if (Array.isArray(isRegistered) && isRegistered.length > 0) {
            this.snackBar.open('You are already registered for this competition.', 'Close', {
              duration: 3000,
            });
          } else if (typeof isRegistered === 'boolean' && isRegistered) {
            this.snackBar.open('You are already registered for this competition.', 'Close', {
              duration: 3000,
            });
          } else {
            this.registerParticipation(userId, competitionId);
          }
        },
        error: (error) => {
          console.error('Failed to check registration status:', error);
          this.snackBar.open('Failed to check registration status.', 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      console.error('User ID not found in token');
      this.snackBar.open('User ID not found in token.', 'Close', {
        duration: 3000,
      });
    }
  }
  registerParticipation(userId: string, competitionId: string): void {
    this.participationService.registerParticipation({ userId, competitionId }).subscribe({
      next: (response) => {
        console.log('Participation registered successfully:', response);
        this.snackBar.open('Participation registered successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Failed to register participation:', error);
        this.snackBar.open('Failed to register participation.', 'Close', {
          duration: 3000,
        });
      }
    });
  }
  showPodium(competitionId: string): void {
    this.participationService.getCompetitionPodium(competitionId).subscribe({
      next: (data) => {
        this.podiumData = data;
        this.dialog.open(PodiumDialogComponent, {
          width: '400px',
          data: { podium: this.podiumData }
        });
      },
      error: (error) => {
        console.error('Failed to fetch podium data', error);
      }
    });
  }

  deleteCompetition(id: string): void {
    this.competitionService.deleteCompetition(id).subscribe({
      next: () => {
        this.dataSource = this.dataSource.filter(competition => competition.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete competition:', error);
      }
    });
  }
}
