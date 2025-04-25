import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      employeeId: [''],
      email: [''],
      password: [''],
      role: ['EMPLOYEE'] // default
    });
  }
  

  register() {
    this.authService.register(this.form.value).subscribe({
      next: () => {
        alert('Registered!');
        this.router.navigate(['/auth/login']);
      },
      error: () => alert('Failed to register')
    });
  }
}
