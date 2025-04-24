import { Routes } from '@angular/router';
import { EmployeeUploadComponent } from '../pages/employee-upload.component'; // Adjust with actual file
import { EmployeeDashboardComponent } from '../pages/employee-dashboard.component'; // Adjust with actual file

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: EmployeeDashboardComponent
  },
  {
    path: 'upload',
    component: EmployeeUploadComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
