import { HostListener, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { HTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ResultModel } from '../models/result.model';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  email: string;

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
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  @HostListener('document:payment.success', ['$event'])
  onPaymentSuccess(event: any): void {
      debugger;
      console.log(JSON.stringify(event));
      /*
      this.paymentService.updateOrder(event.detail).subscribe(
      data => {
          this.paymentId = event.detail.razorpay_payment_id;
      }
      ,
      err => {
          this.error = err.error.message;
      }
      );
      */
  }

  // public methods
  login(contact: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("user/login", {contact: contact, password: password}, false).pipe(
      map(
        (result: ResultModel) => {
          if (result.success){
            localStorage.setItem("token", result.data.token);
            this.currentUserValue = result.data;
            this.getUserByToken()
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

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    if (!localStorage.getItem("token")) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    return this.httpService.post("user/me", {}, true).pipe(
      map((result: any) => {
        if (result) {
          this.currentUserSubject.next(result.data.user);
        } else {
          this.logout();
        }
        return result;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  register(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("account/register", user, false).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
        localStorage.setItem("accountEmail", user.email)
        localStorage.setItem("accountPhone", user.phoneNumber)
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

  verifyEmail(email:string, verificationCode: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("account/verify-email", {email: email, code: verificationCode}, false).pipe(
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

  verifyPhone(verificationCode: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("account/verify-phone", {email: this.email, code: verificationCode}, false).pipe(
      map((result) => {
        localStorage.setItem("token", result.data.token);
        this.currentUserValue = result.data;
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

  forgotPassword(email: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("user/forgotPassword", {email: email}, false).pipe(
      map((result) => {
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

  resetPassword(email: string, code: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("user/resetPassword", {email: email, code: code, password: password}, false).pipe(
      map((result) => {
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


  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
