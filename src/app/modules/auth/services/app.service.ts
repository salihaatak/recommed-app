import { EventEmitter, HostListener, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { HTTPService } from './auth-http';
import { Router } from '@angular/router';
import { ResultModel } from '../models/result.model';
import { ApiResultModel } from '../models/api-result.mode';
import { Recommendation } from '../models/recommendation.model';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AppService implements OnDestroy {
  eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  role: string;
  email: string;
  phoneNumber: string;
  contact: string;

  get IsAndroid(): boolean {
    return navigator.userAgent.toLowerCase().indexOf("android") > -1;
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private httpService: HTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(contact: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("user/login", {contact: contact, password: password}, false).pipe(
      map(
        (result: ResultModel) => {
          if (result.success){
            localStorage.setItem("token", result.data.token);
            return result.data;
          }
          return false
        }
      ),
      catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }
      ),
      finalize(
        () => this.isLoadingSubject.next(false)
      )
    );
  }

  me(): Observable<UserType> {
    if (!localStorage.getItem("token")) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    return this.httpService.post("user/me", {}, true).pipe(
      map((result: any) => {
        if (result) {
          localStorage.setItem('role', result.data.user.role)
          this.role = result.data.user.role;
          this.currentUserSubject.next(result.data.user);
        } else {
          this.logout();
        }
        return result;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/auth'], {
      queryParams: {},
    });
  }

  getDashboardRoute(){
    switch (this.currentUserValue?.role) {
      case "r": return '/dashboard/recommender'; break;
      case "u": case "o": return  '/dashboard/account'; break;
      default: return  '/'; break;
    }
  }

  sendPhoneVerificationCode(email: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("account/send-phone-verification-code", {email: email}, false).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
        return true;
      }),
      //switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  post(endpoint: string, data: any = {}, auth: boolean = true): Observable<ApiResultModel | undefined> {
    this.isLoadingSubject.next(true);
    return this.httpService.post(endpoint, data, auth).pipe(
      map((result: ApiResultModel | undefined) => {
        this.isLoadingSubject.next(false);
        return result;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
