
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserService } from '../../../services/user-service.service';

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
    MatProgressBarModule
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  displayedColumns1: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource1: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.searchUsers({}, 0, 10).subscribe(
      (data) => {
        this.dataSource1 = data.map(user => ({

          uname: `${user.firstName} ${user.lastName}`,
          email: user.email,
          cin: user.cin,
          nationality: user.nationality,
          role: user.role,
          id: user.id
        }));
      },
      (error) => {
        console.error('Failed to load users:', error);
      }
    );
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.dataSource1 = this.dataSource1.filter(user => user.id !== id);
      },
      (error) => {
        console.error('Failed to delete user:', error);
      }
    );
  }
}
