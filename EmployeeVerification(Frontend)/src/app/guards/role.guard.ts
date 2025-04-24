import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.authService.getRole(); // ✅ Use service instead of direct localStorage
  
    console.log('RoleGuard - expected:', expectedRole, 'user has:', userRole);
  
    if (!userRole || userRole !== expectedRole) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  
    return true;
  }
}  
