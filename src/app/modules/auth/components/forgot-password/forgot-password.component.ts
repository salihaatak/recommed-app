import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form1: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(320),
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .post('user/forgot-password', {email: this.form1.controls.email.value})
      .subscribe((result: ApiResultModel | undefined) => {
        if (result){
          this.authService.email = this.form1.controls.email.value;
          this.router.navigate(['auth/reset-password']);
          this.errorState = ErrorStates.NoError;
        } else {
          this.errorState = ErrorStates.HasError;
        }
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
