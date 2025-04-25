import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-hr-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl:'./hr-dashboard.component.html',
  styleUrl:'./hr-dashboard.component.scss'
})
export class HrDashboardComponent implements OnInit {
  hrName: string = '';
  pendingGroups: any[] = [];
  completedGroups: any[] = [];
  selectedEmployee: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    
    this.loadGroupedDocuments();
    this.loadManagerName();  // Fetch manager name when component initializes

  }

  loadManagerName() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT to get the payload
      const employeeId = decodedToken.employeeId;
      console.log(employeeId);

      // Fetch manager name using the employeeId from the token
      this.http.get<any>(`http://localhost:5000/api/employee/users/${employeeId}`).subscribe({
        next: (data) => {
          this.hrName = data.name;  // Assuming 'name' is part of the response
        },
        error: () => alert('Failed to load manager details')
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }

  loadGroupedDocuments() {
    const token = localStorage.getItem('token');
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  
    this.http.get<any[]>('http://localhost:5000/api/documents/hr/grouped-status', headers).subscribe({
      next: (groups) => {
        console.log('Grouped response from backend:', groups);
    
        // Filter pending documents based on the pendingHR flag
        this.pendingGroups = groups.filter(group => group.pendingHR);
    
        // Filter completed documents based on the allHRReviewed flag
        this.completedGroups = groups.filter(group => group.allHRReviewed);
    
        console.log('Pending groups:', this.pendingGroups); // Debug pending groups
        console.log('Completed groups:', this.completedGroups); // Debug completed groups
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load grouped documents');
      }
    });
    
  }
  
  

  selectEmployee(group: any) {
    this.selectedEmployee = group;
  }

  verifyHR(id: string, status: string, comment: string | null | undefined) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const payload = {
      finalVerifiedStatus: status,
      finalComment: comment || ''  // fallback to empty string if null/undefined
    };
  
    console.log('Sending to backend:', payload);
  
    this.http.patch(`http://localhost:5000/api/documents/hr/verify/${id}`, payload, { headers })
    .subscribe({
      next: () => {
        alert('HR verification successful');
        this.loadGroupedDocuments(); // 🔁 Reload the updated data
        this.selectedEmployee = null; // Optional: close current view
      },
      error: () => alert('Failed to verify document')
    });
  }
  
  
}