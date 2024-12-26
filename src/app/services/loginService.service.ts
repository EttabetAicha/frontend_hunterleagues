import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
}

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
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth-token', response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      catchError(error => {
        console.error('Logout failed:', error);
        return throwError(() => error);
      }),
      tap(() => {
        this.clearAuthAndRedirect();
      })
    ).subscribe();
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  private clearAuthAndRedirect(): void {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/authentication/login']);
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error instanceof ErrorEvent
      ? error.error.message
      : error.error.message || 'Server error';

    return throwError(() => ({
      error: { message: errorMessage }
    }));
  }
}
