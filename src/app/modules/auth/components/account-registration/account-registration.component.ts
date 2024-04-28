import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first, map } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';
import { AccountRegistrationService } from '../../services/account-registration.service';

@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.scss'],
})
export class AccountRegistrationComponent implements OnInit, OnDestroy, AfterViewInit {
  form1: FormGroup;
  hasError: boolean;
  phoneNumber: intlTelInput.Plugin;
  state: string = 'form';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router,
    private httpService: HttpClient,
    public accountRegistrationService: AccountRegistrationService
  ) {
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    localStorage.removeItem("token");
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        accountName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
        agreeOptin: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

  }

  ngAfterViewInit(): void {
    const tel = document.querySelector("#phoneNumber");
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

  switchState(state: string) {
    this.state = state;
    window.scrollTo(0, 0);
    setTimeout(()=>{
      this.ngAfterViewInit();
    }, 3000)
  }

  submit() {
    this.hasError = false;
    const s = this.appService
      .post(
        'account/register',
        {
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
          accountName: this.form1.controls["accountName"].value,
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          optin: this.form1.controls["agreeOptin"].value,
          firebaseToken: localStorage.getItem("firebase_token"),
          deviceId: localStorage.getItem("device_id")
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem("accountUid", result.data.uid)
          localStorage.setItem("accountPhone", result.data.phoneNumber)
          this.appService.phoneNumber = this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164)
          this.router.navigate(['/auth/account/registration-phone-verification']);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(s);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
