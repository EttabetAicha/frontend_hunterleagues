import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ParticipationResponse {
  id: string;
  userId: string;
  competitionId: string;
  username: string;
  competitionName?: string;
  code: string;
}
@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8081/api/participations';
  private huntApiUrl = 'http://localhost:8081/api/hunts';

  constructor(private http: HttpClient) {}

  getAllParticipations(): Observable<ParticipationResponse[]> {
    return this.http.get<ParticipationResponse[]>(this.apiUrl);
  }
  registerParticipation(participation: { userId: string; competitionId: string }): Observable<ParticipationResponse> {
    return this.http.post<ParticipationResponse>(`${this.apiUrl}/register`, participation);
  }

  registerHunt(huntRequest: { participationId: string; speciesId: string; weight: number }): Observable<any> {
    return this.http.post<any>(`${this.huntApiUrl}`, huntRequest);
  }

  isUserRegistered(userId: string, competitionId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/results/${userId}/${competitionId}`);
  }

  getCompetitionResults(userId: string, competitionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/results/${userId}/${competitionId}`);
  }

  getCompetitionPodium(competitionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/podium/${competitionId}`);
  }
}
