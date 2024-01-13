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
import { Location } from '@angular/common';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AppService implements OnDestroy {
  eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  private socket: Socket = io(environment.wsUrl, {
    reconnection: true,
    reconnectionAttempts: 9999,
  });

  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  currentUserSubject: BehaviorSubject<UserType> = new BehaviorSubject<UserType>(undefined);
  currentUserObservable: Observable<UserType> = this.currentUserSubject.asObservable();

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  role: 'r' | 'o' | 'u';
  email: string;
  phoneNumber: string;
  contact: string;
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
    private router: Router,
    private location: Location
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
  login(phoneNumber: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("user/login", {phoneNumber: phoneNumber, password: password}, false).pipe(
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
    //localStorage.removeItem("encryptionKey");
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

  // TODO: Bunu da post method'una geçir kaldır
  sendPhoneVerificationCode(phoneNumber: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpService.post("account/send-phone-verification-code", {phoneNumber: phoneNumber}, false).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
        return true;
      }),
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

  generateRandomString(length: number = 10): string {
    const characters = 'abcdefhkmnprstuvyz23456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  mask(text: string, maskDigits = 2): string {
    let r = '';

    if (text) {
        const textLength = text.length;

        const visibleDigits = textLength - maskDigits; // Maskelemeden önce görünür bırakılacak karakter sayısı

        // Maskelenmiş karakter sayısı kadar "*" içeren bir dize oluştur
        const mask = '*'.repeat(maskDigits);

        // Maskelenmiş karakterleri yerine koyarak sonuç dizesini oluştur
        const maskedText = text.substring(0, visibleDigits) + mask;

        r = maskedText;
    }

    return r;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
