import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Document } from '../models/document.model';
@Component({
  selector: 'app-manager-document-approval',
  templateUrl: './manager-document-approval.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})

export class ManagerDocumentApprovalComponent implements OnInit {
  documents: Document[] = [];  // Use the Document type for documents

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch pending documents for approval
    this.http.get<Document[]>('/api/documents/pending').subscribe({
      next: (docs) => {
        this.documents = docs;
      },
      error: () => alert('Failed to fetch documents')
    });
  }

  approveDocument(id: string) {
    this.http.patch(`/api/documents/verify/${id}`, { status: 'approved' }).subscribe({
      next: () => {
        alert('Document approved');
        this.ngOnInit();  // Reload documents
      },
      error: () => alert('Failed to approve document')
    });
  }

  rejectDocument(id: string) {
    this.http.patch(`/api/documents/verify/${id}`, { status: 'rejected' }).subscribe({
      next: () => {
        alert('Document rejected');
        this.ngOnInit();  // Reload documents
      },
      error: () => alert('Failed to reject document')
    });
  }
}
