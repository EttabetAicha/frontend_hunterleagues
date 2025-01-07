import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Species {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  points: number;
  minimumWeight:DoubleRange;
}

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  private apiUrl = 'http://localhost:8081/api/species';
  constructor(private http: HttpClient) {}

  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(this.apiUrl);
  }


  addSpecies(species: Species): Observable<Species> {
    return this.http.post<Species>(this.apiUrl, species);
  }

  updateSpecies(species: Species): Observable<Species> {
    return this.http.put<Species>(`${this.apiUrl}/${species.id}`, species);
  }

  deleteSpecies(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
