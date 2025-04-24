import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch employee profile
  getProfile(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get('http://localhost:5000/api/employee/profile', { headers });
  }

  // Create employee profile
  createProfile(profileData: any): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post('http://localhost:5000/api/employee/profile', profileData, { headers });
  }
  

  // Fetch documents uploaded by the employee
  getMyDocuments(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get('http://localhost:5000/api/documents/my-documents', { headers });
  }
}
