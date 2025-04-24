import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from './employee.service';
import { AuthService } from '../core/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-employee-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-dashboard.component.html',
})
export class EmployeeDashboardComponent implements OnInit {
  profile: any = null;
  documents: any[] = [];
  managerName: string = ''; // Store manager name here

  profileData: any = {
    name: '',
    address: '',
    yearsOfExperience: 0,
    previousCompanies: [''],
    status: 'FRESH',
    aadharNumber: '',
    panNumber: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient  // Inject HttpClient to make HTTP requests
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.loadManagerName();  // Fetch manager name when component initializes
  }

  // Fetch the profile if it exists
  fetchProfile() {
    this.employeeService.getProfile().subscribe({
      next: (res: any) => {
        console.log('Profile fetched:', res);
        this.profile = res.employee;  // Populate the profile if it exists
        this.fetchDocuments();
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('Profile not found, prompting to create profile.');
        } else {
          alert('Failed to load profile');
        }
      }
    });
  }
  
  // Fetch the documents
  fetchDocuments() {
    this.employeeService.getMyDocuments().subscribe({
      next: (res: any) => {
        this.documents = res.documents;  // Populate documents
      },
      error: () => alert('Failed to load documents')
    });
  }

  // Fetch manager's name using the employeeId from the JWT token
  loadManagerName() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT to get the payload
      const employeeId = decodedToken.employeeId;
      console.log('Employee ID:', employeeId);

      // Fetch manager name using the employeeId from the token
      this.http.get<any>(`http://localhost:5000/api/employee/users/${employeeId}`).subscribe({
        next: (data) => {
          this.managerName = data.name;  // Assuming 'name' is part of the response
        },
        error: () => alert('Failed to load manager details')
      });
    }
  }

  // Create a new profile
  createProfile() {
    this.employeeService.createProfile(this.profileData).subscribe({
      next: (response: any) => {
        console.log('Profile created successfully', response);
        this.profile = response.employee;  // Update profile with newly created data
        this.router.navigate(['/employee/dashboard']);  // Redirect to dashboard
      },
      error: (error) => {
        console.error('Profile creation failed', error);
        alert('Failed to create profile');
      }
    });
  }

  // Logout user
  logout() {
    this.auth.logout();  // Clear token
    this.router.navigate(['/auth/login']);  // Redirect to login
  }
}
