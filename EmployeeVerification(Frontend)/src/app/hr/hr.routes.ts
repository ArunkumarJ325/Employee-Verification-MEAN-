import { Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component'; // Adjust with actual file
import { HrDocumentApprovalComponent } from '../hr/hr-document-approval.component'; // Adjust with actual file

export const HR_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: HrDashboardComponent
  },
  {
    path: 'approve-documents',
    component: HrDocumentApprovalComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
