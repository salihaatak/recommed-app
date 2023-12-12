import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';

@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.scss'],
})
export class AccountRegistrationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router
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
        email: [
          '',
          Validators.compose([
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        agree: [true, Validators.compose([Validators.required])],
        agreeOptin: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
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
          phoneNumber: this.form1.controls["phoneNumber"].value,
          password: this.form1.controls["password"].value,
          email: this.form1.controls["email"].value,
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
          this.appService.phoneNumber = this.form1.controls["phoneNumber"].value
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
