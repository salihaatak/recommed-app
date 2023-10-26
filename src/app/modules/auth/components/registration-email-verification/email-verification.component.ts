import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';

@Component({
  selector: 'app-registration-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class RegistrationEmailVerificationComponent implements OnInit, OnDestroy {
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
  }

  initForm() {
    this.form1 = this.fb.group(
      {
        emailVerificationCode: [
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
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(this.form1.controls).forEach((key) => {
      result[key] = this.form1.controls[key].value;
    });
    const newUser = new UserModel();
    newUser.setUser(result);
    const registrationSubscr = this.authService
      .verifyEmail(this.authService.email, this.form1.controls["emailVerificationCode"].value)
      .pipe(first())
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['auth/registration-phone-verification']);
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
