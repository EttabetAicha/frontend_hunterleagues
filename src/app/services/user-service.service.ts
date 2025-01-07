import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponse {
  id: string;
  cin: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  searchUsers(userSearchRequest: any, page: number, size: number): Observable<UserResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<UserResponse[]>(this.apiUrl, {
      params,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  addUser(userRequest: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userRequest);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`);
  }

  getUserCompetitionHistory(id: string, page: number, size: number): Observable<any[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any[]>(`${this.apiUrl}/history/${id}`, { params });
  }


  login(authRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, authRequest);
  }
  
}
