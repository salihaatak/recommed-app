import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form1: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group({
      code: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
      cPassword: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.appService
      .post('user/reset-password', {
        contact: this.appService.contact,
        code: this.form1.controls.code.value,
        password: this.form1.controls.password.value,
        firebaseToken: localStorage.getItem("firebase_token")
      }, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          localStorage.setItem('token', result.data.token)
          this.appService.me().subscribe(()=>{
            this.router.navigate([this.appService.getDashboardRoute()]);
          })
        } else {
          this.errorState = this.errorStates.HasError
        }
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
