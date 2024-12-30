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
import { AddSpeciesDialogComponent } from './add-user.component';



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
  templateUrl: './species.component.html',
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
    openAddDialog(): void {
      const dialogRef = this.dialog.open(AddSpeciesDialogComponent, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadSpecies();
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
