import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  login() {
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        console.log('User Role:', res.user.role);
      
        localStorage.setItem('token', res.token);
        this.authService.setRole(res.user.role); // ✅ Use service setter
      
        this.redirectBasedOnRole(res.user.role);
      },
      error: (err) => {
        console.error('Login Error:', err);
        alert('Login failed');
      }
    });
  }
  
  

  redirectBasedOnRole(role: string) {
    console.log('Redirecting to:', role);

    const path = role === 'EMPLOYEE' ? '/employee/dashboard'
    : role === 'MANAGER' ? '/manager/dashboard'
    : role === 'HR' ? '/hr/document-approval'
    : '/';

console.log('Final redirect path:', path);
this.router.navigate([path]);
  }
}
