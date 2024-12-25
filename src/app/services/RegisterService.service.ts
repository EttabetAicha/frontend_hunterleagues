import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  cin: string;
  email: string;
  nationality: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, data).pipe(
      catchError(this.handleError)
    );
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
        message: errorMessage,
      },
    }));
  }
}
