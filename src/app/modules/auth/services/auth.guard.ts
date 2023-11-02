import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // logged in so return true
      return true;
    }

    if (localStorage.getItem("token")){
      const a = await this.authService.me().toPromise();
      this.authService.currentUserSubject.next(a);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
