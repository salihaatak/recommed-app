import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.isLoading$ = this.apiService.isLoading$;
    // redirect to home if already logged in
    if (this.apiService.currentUserValue) {
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
          'qwe',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        lastName: [
          'qwe',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        accountName: [
          'qwe',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          'esrefatak+' + Math.random() * 10000 + '@gmail.com',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        phoneNumber: [
          '5335053495',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ],
        password: [
          'qweqwe',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          'qweqwe',
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
    const s = this.apiService
      .post(
        'account/register',
        {
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["firstName"].value,
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
      .pipe(first())
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem("accountEmail", result.data.email)
          localStorage.setItem("accountPhone", result.data.phoneNumber)
          this.apiService.email = this.form1.controls["email"].value
          this.apiService.phoneNumber = this.form1.controls["phoneNumber"].value
          this.router.navigate(['/auth/account/registration-email-verification']);
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
