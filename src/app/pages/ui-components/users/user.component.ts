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
import { UserService } from '../../../services/user-service.service';
import { AddUserDialogComponent } from './add-user.component';
import { EditUserDialogComponent } from './edit-user.component';

@Component({
  selector: 'app-user',
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
    AddUserDialogComponent
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  displayedColumns1: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource1: any[] = [];
  isLoading = true;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.searchUsers({}, 0, 10).subscribe({
      next: (data) => {
        this.dataSource1 = data.map(user => ({
          uname: `${user.firstName} ${user.lastName}`,
          email: user.email,
          cin: user.cin,
          nationality: user.nationality,
          role: user.role,
          id: user.id
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(element: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: {
        id: element.id,
        firstName: element.uname.split(' ')[0],
        lastName: element.uname.split(' ')[1],
        email: element.email,
        cin: element.cin,
        nationality: element.nationality,
        role: element.role,
        licenseExpirationDate: element.licenseExpirationDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }


  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.dataSource1 = this.dataSource1.filter(user => user.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete user:', error);
      }
    });
  }
}
