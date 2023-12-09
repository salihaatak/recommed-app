import { EventEmitter, HostListener, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { HTTPService } from './auth-http';
import { Router } from '@angular/router';
import { ResultModel } from '../models/result.model';
import { ApiResultModel } from '../models/api-result.mode';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AppService implements OnDestroy {
  eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  private socket: Socket = io(environment.wsUrl, {
    reconnection: true,
    reconnectionAttempts: 20,
  });

  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  currentUserSubject: BehaviorSubject<UserType> = new BehaviorSubject<UserType>(undefined);
  currentUserObservable: Observable<UserType> = this.currentUserSubject.asObservable();
  currenUserValue: UserModel = new UserModel();

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  role: 'r' | 'o' | 'u';
  email: string;
  phoneNumber: string;
  contact: string;
  invitationCode: string;
  socketConnectedBefore: boolean = false;

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

  }

  socketConnect(uid: string) {
    this.socket.on('connect', () => {
      console.log('Bağlandı');
      if (this.socketConnectedBefore) {
        console.log('Bağlantı tekrar kuruldu!');
        this.eventEmitter.emit({type: 'recommendation'});
      }
      this.socketConnectedBefore = true;
    });

    console.log('Dinlemeye başladım. User: ' + uid);
    this.socket.on(uid, (data: any) => {
      console.log('Sunucudan mesaj aldım:', JSON.stringify(data));

      switch(data?.type){
        case "recommendation":
          this.eventEmitter.emit({type: 'recommendation'});
        break;
      }

    });

    this.socket.on('disconnect', () => {
      console.log('Bağlantı koptu!');
    });

    this.socket.on('reconnect', () => {

    });
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
    if (!localStorage.getItem('token') || this.currentUserValue) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);

    return this.httpService.post("user/me", {}, true).pipe(
      map((result: any) => {
        if (result) {
          this.role = result.data.user.role;
          this.invitationCode = result.data.user.account.invitationCode;
          this.currentUserSubject.next(result.data.user);
          this.socketConnect(result.data.user.uid);
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
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/auth'], {
      queryParams: {},
    });
  }

  getDashboardRoute(){
    switch (this.currentUserValue?.role) {
      case "r": return '/dashboard/recommender'; break;
      case "u": case "o": return '/dashboard/provider'; break;
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
      finalize(() => {
        this.isLoadingSubject.next(false)
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
