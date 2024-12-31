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

  constructor(
    private competitionService: CompetitionService,
    private dialog: MatDialog
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

  // openEditDialog(element: Competition): void {
  //   const dialogRef = this.dialog.open(EditCompetitionDialogComponent, {
  //     width: '500px',
  //     data: element
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.loadCompetitions();
  //     }
  //   });
  // }

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
