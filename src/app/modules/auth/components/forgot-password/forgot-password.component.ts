import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';
import { HttpClient } from '@angular/common/http';
import intlTelInput from 'intl-tel-input';

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
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  phoneNumber: intlTelInput.Plugin;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    public appService: AppService,
    private router: Router,
    private httpService: HttpClient
    ) {
  }

  ngOnInit(): void {
    const tel = document.querySelector("#phoneNumberForgotPassword");
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
    this.errorState = ErrorStates.NotSubmitted;
    this.unsubscribe.push(this.appService
      .post('user/forgot-password', {contact: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164)}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result){
          this.appService.contact = this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164);
          this.router.navigate(['auth/reset-password']);
          this.errorState = ErrorStates.NoError;
        } else {
          this.errorState = ErrorStates.HasError;
        }
      }));
  }
}
