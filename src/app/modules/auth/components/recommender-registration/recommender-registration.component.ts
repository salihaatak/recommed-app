import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';

@Component({
  selector: 'app-recommender-registration',
  templateUrl: './recommender-registration.component.html',
  styleUrls: ['./recommender-registration.component.scss'],
})
export class RecommenderRegistrationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  accountName: string;
  invitationCode: string | null;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.apiService.isLoading$;
    // redirect to home if already logged in
    if (this.apiService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.invitationCode = this.route.snapshot.paramMap.get('invitationCode');
    if (this.invitationCode){
      const subscr = this.apiService
      .post("user/verify-invitation", {invitationCode: this.invitationCode}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.accountName = result.data.name;
        } else {
          this.hasError = true;
        }
      });
      this.unsubscribe.push(subscr);
    }
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group(
      {
        verificationCode: [
          'qwe',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
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
        optin: [false, Validators.compose([Validators.required])],
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
        "user/join",
        {
          firebaseToken: localStorage.getItem("firebase_token"),
          deviceId: localStorage.getItem("device_id"),
          invitationCode: this.invitationCode,
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
          phoneNumber: this.form1.controls["phoneNumber"].value,
          password: this.form1.controls["password"].value,
          optin: this.form1.controls["optin"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.apiService.phoneNumber = this.form1.controls["phoneNumber"].value;
          this.router.navigate(['/auth/recommender/phone-verification']);
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
