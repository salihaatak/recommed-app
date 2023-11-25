import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';

declare global {
  interface Window { WebView: any; }
  interface Window { selectContactsCallbackTS: any; }
  interface Window { getLocationCallbackTS: any; }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  public contacts: string;
  public location: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoading$ = this.appService.isLoading$;
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

    window.getLocationCallbackTS = {
      zone: this.zone,
      componentFn: (val: any) => {
        this.location = JSON.stringify(val);

        this.cdr.detectChanges();
      },
      component: this
    }
  }

  initForm() {
    this.form1 = this.fb.group({
      contact: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    const loginSubscr = this.appService
      .login(this.form1.controls.contact.value, this.form1.controls.password.value)
      .subscribe((user: UserModel | undefined) => {
        if (user) {
          this.appService.me().subscribe(()=>{
            this.router.navigate([this.appService.getDashboardRoute()]);
          })
        } else {
          this.hasError = true;
        }

      });
    this.unsubscribe.push(loginSubscr);
  }

  /*
  btnGetLocationClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "getLocation"
    }));
  }

  btnLikeClick(){
    window.WebView.postMessage(JSON.stringify({
      type: "like"
    }))
  }
  */

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getFirebaseToken(){
    return localStorage.getItem("firebase_token")
  }

  reloadPage(){
    window.location.reload()
  }
}
