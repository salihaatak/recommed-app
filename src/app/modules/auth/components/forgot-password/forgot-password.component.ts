import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
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
    private apiService: ApiService,
    private router: Router
    ) {
    this.isLoading$ = this.apiService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group({
      contact: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.apiService
      .post('user/forgot-password', {contact: this.form1.controls.contact.value}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result){
          this.apiService.contact = this.form1.controls.contact.value;
          this.router.navigate(['auth/reset-password']);
          this.errorState = ErrorStates.NoError;
        } else {
          this.errorState = ErrorStates.HasError;
        }
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
