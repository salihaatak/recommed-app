import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { ApiResultModel } from '../../models/api-result.mode';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.appService.currentUserValue) {
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
        invitationCode: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ]
      }
    );
  }

  submit() {
    this.hasError = false;

    const subscr = this.appService
      .post("account/get-by-invitation-code", {
        invitationCode: this.form1.controls["invitationCode"].value
      }, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['/l/i/' + this.form1.controls["invitationCode"].value]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(subscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
