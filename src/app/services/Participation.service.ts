import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Participation {
  id: string;
  userId: string;
  competitionId: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8081/api/participations'; 

  constructor(private http: HttpClient) {}

  getParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(this.apiUrl);
  }

  addParticipation(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(this.apiUrl, participation);
  }

  updateParticipation(participation: Participation): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/${participation.id}`, participation);
  }

  deleteParticipation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getParticipationById(id: string): Observable<Participation> {
    return this.http.get<Participation>(`${this.apiUrl}/${id}`);
  }
}
