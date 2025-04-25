import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Document {
  _id: string;
  documentNumber: string;
  type: string; // or `type` depending on your backend field
  fileUrl: string;
  verifiedStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedBy?: string;
  comment: string;

  // HR final verification fields 👇
  finalVerifiedStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  finalComment?: string;
  finalVerifiedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}


interface EmployeeGroup {
  employee: any; // Replace `any` with a proper Employee interface if available
  documents: Document[];
}

@Component({
  standalone: true,
  selector: 'app-manager-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manager-dashboard.component.html'
})
export class ManagerDashboardComponent implements OnInit {
  groupedDocs: EmployeeGroup[] = [];
  selectedEmployee: EmployeeGroup | null = null;
  managerName: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadGroupedDocuments();
    this.loadManagerName();

  }

  loadGroupedDocuments() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<EmployeeGroup[]>('http://localhost:5000/api/documents/grouped-status', { headers }).subscribe({
      next: (data) => {
        this.groupedDocs = data;
      },
      error: () => alert('Failed to load documents')
    });
  }
  get pendingGroups() {
    return this.groupedDocs.filter(g => g.documents.some(d => d.verifiedStatus === 'PENDING'));
  }
  
  get completedGroups() {
    return this.groupedDocs.filter(g => g.documents.every(d => d.verifiedStatus !== 'PENDING'));
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
          this.managerName = data.name;  // Assuming 'name' is part of the response
        },
        error: () => alert('Failed to load manager details')
      });
    }
  }
  selectEmployee(employeeGroup: EmployeeGroup) {
    this.selectedEmployee = {
      ...employeeGroup,
      documents: [
        ...employeeGroup.documents.filter((d: Document) => d.verifiedStatus === 'PENDING'),
        ...employeeGroup.documents.filter((d: Document) => d.verifiedStatus !== 'PENDING')
      ]
    };
  }

  verify(docId: string | undefined, status: 'APPROVED' | 'REJECTED', comment: string) {
    if (!docId) {
      alert('Invalid document ID');
      return;
    }
  
    // Force docId to be treated as a string
    const id = docId!;  // Non-null assertion operator
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { verifiedStatus: status, comment };
  
    this.http.patch(`http://localhost:5000/api/documents/verify/${id}`, body, { headers }).subscribe({
      next: () => {
        alert(`Document ${status.toLowerCase()} successfully!`);
        this.selectedEmployee = null; // Reset view
        this.loadGroupedDocuments();  // Reload updated data
      },
      error: () => alert(`Failed to ${status.toLowerCase()} document`)
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';  // Redirect to login page// Redirect to login
  }
  
}
