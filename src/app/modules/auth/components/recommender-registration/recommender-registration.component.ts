import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recommender-registration',
  templateUrl: './recommender-registration.component.html',
  styleUrls: ['./recommender-registration.component.scss'],
})
export class RecommenderRegistrationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;
  accountName: string;
  phoneNumber: intlTelInput.Plugin;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    public route: ActivatedRoute,
    private router: Router,
    private httpService: HttpClient
  ) {
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('invitationCode')){
      const subscr = this.appService
      .post("user/check-invitation", {invitationCode: this.route.snapshot.paramMap.get('invitationCode')}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.accountName = result.data.name;
        } else {
          this.hasError = true;
        }
      });
      this.unsubscribe.push(subscr);
    }
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
        agree: [true, Validators.compose([Validators.required])],
        optin: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

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

  submit() {
    this.hasError = false;
    const s = this.appService
      .post(
        "user/join",
        {
          firebaseToken: localStorage.getItem("firebase_token"),
          deviceId: localStorage.getItem("device_id"),
          invitationCode: this.route.snapshot.paramMap.get('invitationCode'),
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          optin: this.form1.controls["optin"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.appService.phoneNumber = this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164);
          this.router.navigate(['/auth/recommender/phone-verification']);
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
