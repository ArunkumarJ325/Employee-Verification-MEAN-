import { Routes } from '@angular/router';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { ManagerDocumentApprovalComponent } from './manager-document-approval.component';


export const MANAGER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./manager-dashboard.component').then(
        (m) => m.ManagerDashboardComponent
      ),
  },
  {
    path: 'document-approval',
    loadComponent: () =>
      import('./manager-document-approval.component').then(
        (m) => m.ManagerDocumentApprovalComponent
      ),
  }
];
