import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/api/auth'; // update if needed

  constructor(private http: HttpClient) {}
  private role: string | null = null;

  setRole(role: string) {
    this.role = role;
    localStorage.setItem('role', role); // Optional, for refreshes
  }

 
  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    localStorage.clear();
    console.log("TOken cleared")
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Use the same key as in login()
  }
  
  getUserRole(): string {
    // Example: retrieve role from stored user info or token
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || '';
  }
  canActivate(): boolean {
    return !!localStorage.getItem('token');
  }
  
  
}
