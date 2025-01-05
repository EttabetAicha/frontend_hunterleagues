import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuntService {
  private apiUrl = 'http://localhost:8081/api/hunts';

  constructor(private http: HttpClient) {}

  registerHunt(huntRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, huntRequest);
  }
}
