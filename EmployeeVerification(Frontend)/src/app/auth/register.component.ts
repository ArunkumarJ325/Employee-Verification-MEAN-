import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl:'./register.component.scss'
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
    this.form = this.fb.group({
      name: ['', Validators.required],
      employeeId: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      role: ['', Validators.required]
    });
    
  }
  

  register() {
    this.authService.register(this.form.value).subscribe({
      next: () => {
        alert('Registered!');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.status === 400 && err.error.errors) {
          const messages = err.error.errors.map((e: any) => e.msg).join('\n');
          alert('Validation Error:\n' + messages);
        } else {
          alert('Failed to register');
        }
      }
    });
  }
  
}
