import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private apiUrl = 'http://localhost:8081/api/competitions'; // Adjust the URL to your backend endpoint

  constructor(private http: HttpClient) {}

  getCompetitions(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  addCompetition(competition: Competition): Observable<Competition> {
    return this.http.post<Competition>(this.apiUrl, competition);
  }

  updateCompetition(competition: Competition): Observable<Competition> {
    return this.http.put<Competition>(`${this.apiUrl}/${competition.id}`, competition);
  }

  deleteCompetition(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/${id}`);
  }
}
