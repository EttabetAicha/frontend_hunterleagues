import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ParticipationResponse {
  id: string;
  username: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8081/api/participations';

  constructor(private http: HttpClient) {}

  registerParticipation(participation: { userId: string; competitionId: string }): Observable<ParticipationResponse> {
    return this.http.post<ParticipationResponse>(`${this.apiUrl}/register`, participation);
  }

  getCompetitionResults(userId: string, competitionId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/results/${userId}/${competitionId}`
    );
  }

  getCompetitionPodium(competitionId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/podium/${competitionId}`
    );
  }
}
