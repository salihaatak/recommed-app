import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';
import { ApiResultModel } from '../../models/api-result.mode';
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
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  form1: FormGroup;
  error: string | undefined | null;
  returnUrl: string;
  phoneNumber: intlTelInput.Plugin;
  phoneEntered: boolean = false;
  loginVerificationCodeEntered: boolean = false;
  invitationCode: string;

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

  renderPhoneNumberInput() {
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

  ngAfterViewInit(): void {
    this.renderPhoneNumberInput();
  }

  initForm() {
    this.form1 = this.fb.group({
      loginVerificationCode: [
        null
      ],
      invitationCode: [
        null
      ],
      firstName: [
        null
      ],
      lastName: [
        null
      ],
      sex: [
        null
      ],
    });
  }

  sendLoginVerificationCode(){
    const s = this.appService
      .post(
        "user/send-login-verification-code",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.phoneEntered = true;
        } else {
          this.error = result?.message;
        }
      });
    this.unsubscribe.push(s);

  }

  submit() {
    this.error = null;
    const s = this.appService
      .post(
        "user/login-with-verification-code",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          loginVerificationCode: this.form1.controls["loginVerificationCode"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          if (result.data.token) {
            localStorage.setItem("token", result.data.token);
            this.appService.me().subscribe(()=>{
              this.router.navigate([this.appService.getDashboardRoute()]);
            })
          } else {
            this.loginVerificationCodeEntered = true;
            this.invitationCode = result.data.invitationCode;
            this.form1.get('invitationCode')?.setValue(result.data.invitationCode)
          }
        } else {
          this.error = result?.message;
        }
      });
    this.unsubscribe.push(s);
  }

  loginWithInvitationCode() {
    this.error = null;
    const s = this.appService
      .post(
        "user/login-with-invitation-code",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          loginVerificationCode: this.form1.controls["loginVerificationCode"].value,
          invitationCode: this.form1.controls["invitationCode"].value,
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
          sex: this.form1.controls["sex"].value,
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem("token", result.data.token);
          this.appService.me().subscribe(()=>{
            this.router.navigate([this.appService.getDashboardRoute()]);
          })
        } else {
          this.error = result?.message;
        }
      });
    this.unsubscribe.push(s);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
