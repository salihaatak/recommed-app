import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { ConfirmPasswordValidator } from '../account-registration/confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';

@Component({
  selector: 'app-account-registration--phone-verification',
  templateUrl: './account-registration-phone-verification.component.html',
  styleUrls: ['./account-registration-phone-verification.component.scss'],
})
export class AccountRegistrationPhoneVerificationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router
  ) {
    this.isLoading$ = this.appService.isLoading$;
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();

    const registrationSubscr = this.appService
      .sendPhoneVerificationCode(this.appService.phoneNumber)
      .subscribe((user: UserModel) => {
      });
    this.unsubscribe.push(registrationSubscr);

  }

  initForm() {
    this.form1 = this.fb.group(
      {
        phoneVerificationCode: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(4)
          ]),
        ]
      }
    );
  }

  submit() {
    this.hasError = false;
    const s = this.appService
      .post(
        'account/verify-phone',
        {
          phoneNumber: this.appService.phoneNumber,
          verificationCode: this.form1.controls["phoneVerificationCode"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem('token', result?.data.token)
          this.appService.me().subscribe(()=>{
            this.router.navigate([this.appService.getDashboardRoute()]);
          })
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
