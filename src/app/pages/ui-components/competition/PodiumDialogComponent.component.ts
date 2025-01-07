import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-podium-dialog',
  template: `
    <h2 mat-dialog-title>Podium</h2>
    <mat-dialog-content>
      <ul>
        <li *ngFor="let participant of data.podium">
          {{ participant.firstName }} {{ participant.lastName }} - Score: {{ participant.score }}
        </li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class PodiumDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PodiumDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { podium: any[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
