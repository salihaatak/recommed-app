import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
    public apiService: ApiService,
    private router: Router
  ) {
    this.isLoading$ = this.apiService.isLoading$;
    // redirect to home if already logged in
    if (this.apiService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();

    const registrationSubscr = this.apiService
      .sendPhoneVerificationCode(this.apiService.email)
      .pipe(first())
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
    const s = this.apiService
      .post(
        'account/verify-phone',
        {
          email: this.apiService.email,
          code: this.form1.controls["phoneVerificationCode"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem('token', result?.data.token)
          this.apiService.me().subscribe(()=>{
            this.router.navigate([this.apiService.getDashboardRoute()]);
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
