import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private apiService: ApiService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.apiService.currentUserValue;

    if (currentUser) {
      // logged in so return true
      return true;
    }

    if (localStorage.getItem("token")){
      const a = await this.apiService.me().toPromise();
      this.apiService.currentUserSubject.next(a);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.apiService.logout();
    return false;
  }
}
