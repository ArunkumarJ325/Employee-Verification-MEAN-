import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-employee-upload',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-upload.component.html',
  styleUrl:'./employee-upload.component.scss'
})
export class EmployeeUploadComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  dynamicLabel: string = 'Enter Document Number';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      documentNumber: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    console.log('Upload component loaded');
    this.form.get('type')?.valueChanges.subscribe(type => {
      this.updateLabel();
    });
  }

  updateLabel(): void {
    const type = this.form.get('type')?.value;
    switch (type) {
      case 'AADHAR':
        this.dynamicLabel = 'Enter Aadhar Number';
        break;
      case 'PAN':
        this.dynamicLabel = 'Enter PAN Number';
        break;
      case 'ADDRESS_PROOF':
        this.dynamicLabel = 'Enter EB Bill Number';
        break;
      case 'QUALIFICATION':
        this.dynamicLabel = 'Enter University Registration Number';
        break;
      default:
        this.dynamicLabel = 'Enter Document Number';
    }
  }
  

  
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  
  upload(): void {
    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }
  
    const formData = new FormData();
    formData.append('type', this.form.value.type);
    formData.append('documentNumber', this.form.value.documentNumber);
    formData.append('file', this.selectedFile);
  
    const token = localStorage.getItem('token');
  
    this.http.post('http://localhost:5000/api/documents/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        alert('Document uploaded successfully!');
        this.router.navigate(['/employee/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed');
      }
    });
  }
  
}
