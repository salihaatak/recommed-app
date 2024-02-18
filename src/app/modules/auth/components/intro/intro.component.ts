import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResultModel } from '../../models/api-result.mode';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, OnDestroy {
  hasError: boolean;
  returnUrl: string;
  form1: FormGroup;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    public appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {

    if (localStorage.getItem("token")){
      this.appService.me().subscribe(()=>{
        if (this.route.snapshot.queryParams['returnUrl']){
          this.router.navigate([this.route.snapshot.queryParams['returnUrl']]);
        } else {
          this.router.navigate([this.appService.getDashboardRoute()]);
        }
      })
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form1 = this.fb.group(
      {
        invitationCode: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ]
      }
    );
  }

  submit() {
    this.hasError = false;

    const subscr = this.appService
      .post("user/check-invitation", {
        invitationCode: this.form1.controls["invitationCode"].value
      }, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['/auth/recommender/registration/' + this.form1.controls["invitationCode"].value]);
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
