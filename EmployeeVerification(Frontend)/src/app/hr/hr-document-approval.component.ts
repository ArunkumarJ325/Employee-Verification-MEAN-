
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Document } from '../models/document.model';  // Import the Document interface

@Component({
  selector: 'app-hr-document-approval',
  templateUrl: './hr-document-approval.component.html',
  imports: [CommonModule, RouterModule],
})


export class HrDocumentApprovalComponent implements OnInit {
  documents: Document[] = [];  // Using the Document interface for strongly typed documents

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch manager-approved documents for HR final approval
    this.http.get<Document[]>('/api/documents/approved-manager').subscribe((docs) => {
      this.documents = docs;
    });
  }

  finalizeApproval(id: string) {
    // Assuming you have a document ID to finalize the approval process
    this.http.patch(`/api/documents/hr/verify/${id}`, { finalVerifiedStatus: 'APPROVED' }).subscribe({
      next: () => {
        alert('Document finalized and approved');
        this.ngOnInit();  // Reload documents
      },
      error: () => alert('Failed to finalize approval')
    });
  }
}
