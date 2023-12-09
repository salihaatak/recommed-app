import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from './app.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private appService: AppService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.appService.currentUserValue;

    if (currentUser) {
      // logged in so return true
      return true;
    }

    if (localStorage.getItem('token')){
      const a = await this.appService.me().toPromise();
      this.appService.currentUserSubject.next(a);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.appService.logout();
    return false;
  }
}
