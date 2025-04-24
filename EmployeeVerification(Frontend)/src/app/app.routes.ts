import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ManagerDashboardComponent } from './manager/manager-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../app/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('../app/employee/employee.route').then((m) => m.EMPLOYEE_ROUTES),
    canActivate: [AuthGuard],  // Protecting employee routes with AuthGuard
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('../app/manager/manager.routes').then((m) => m.MANAGER_ROUTES),
    canActivate: [AuthGuard, RoleGuard], // Protecting manager routes with both Auth and Role Guard
    data: { role: 'MANAGER' },
  },
  {
    path: 'hr',
    loadChildren: () =>
      import('../app/hr/hr.routes').then((m) => m.HR_ROUTES),
    canActivate: [AuthGuard, RoleGuard], // Protecting HR routes with both Auth and Role Guard
    data: { role: 'HR' },
  },
  
  {
    path: 'employee/dashboard',
    loadComponent: () =>
      import('./pages/employee-dashboard.component').then(
        (m) => m.EmployeeDashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'employee/upload',
    loadComponent: () =>
      import('./pages/employee-upload.component').then(
        (m) => m.EmployeeUploadComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'manager/document-approval',
    loadComponent: () =>
      import('./manager/manager-document-approval.component').then(
        (m) => m.ManagerDocumentApprovalComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
  },
  
  {
    path: 'hr/document-approval',
    loadComponent: () =>
      import('./hr/hr-document-approval.component').then(
        (m) => m.HrDocumentApprovalComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
  }
  
];
