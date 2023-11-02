import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from '../account-registration/confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';

@Component({
  selector: 'app-recommender-phone-verification',
  templateUrl: './recommender-phone-verification.component.html',
  styleUrls: ['./recommender-phone-verification.component.scss'],
})
export class RecommenderPhoneVerificationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();

    const subscr = this.authService.post(
          'user/send-phone-verification-code',
          {phoneNumber: this.authService.phoneNumber}
        )
      .subscribe((result: ApiResultModel | undefined) => {
      });
    this.unsubscribe.push(subscr);

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
    const registrationSubscr = this.authService
      .post(
        'user/verify-phone',
        {
          phoneNumber: this.authService.phoneNumber,
          verificationCode: this.form1.controls["phoneVerificationCode"].value
        }
        )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem("token", result?.data.token);
          this.authService.me().subscribe(()=>{
            this.router.navigate([this.authService.getDashboardRoute()]);
          })
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
