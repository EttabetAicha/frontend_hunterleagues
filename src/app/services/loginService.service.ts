import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interface for the login response
export interface LoginResponse {
  token: string;
}

// Interface for the login request
export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  logout() {

    this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('auth-token');
        this.router.navigate(['/authentication/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);

        localStorage.removeItem('auth-token');
        this.router.navigate(['/authentication/login']);
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error.message || 'Server error';
    }

    return throwError(() => ({
      error: {
        message: errorMessage
      }
    }));
  }
}
