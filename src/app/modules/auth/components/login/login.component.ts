import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';
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
  phoneNumber: intlTelInput.Plugin;

  public contacts: string;
  public location: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private httpService: HttpClient
  ) {
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
      this.router.navigate([appService.getDashboardRoute()]);
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
      /*
      contact: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(320),
        ]),
      ],
      */
      password: [
        null
      ],
    });

    const tel = document.querySelector("#phoneNumberLogin");
    if (tel) {
      this.phoneNumber = intlTelInput(tel, {
        //initialCountry: 'tr',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      });
      this.httpService.get("https://ipapi.co/json").subscribe((result: any) => {
        this.phoneNumber.setCountry(result.country_code);
      });
    }
  }

  submit() {
    this.hasError = false;
    const loginSubscr = this.appService
      .login(this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164), this.form1.controls.password.value)
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
