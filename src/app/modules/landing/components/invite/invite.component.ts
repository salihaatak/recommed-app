import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from '../../models/api-result.mode';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent implements OnInit, OnDestroy, AfterViewInit {
  form1: FormGroup;
  hasError: boolean;
  returnUrl: string;
  accountName: any;
  invitationCode: string | null;
  phoneEntered: boolean = false;
  phoneVerified: boolean = false;
  phoneNumber: intlTelInput.Plugin;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    public fb: FormBuilder,
    public appService: AppService,
    public route: ActivatedRoute,
    public cdr: ChangeDetectorRef,
    public httpService: HttpClient,
    public router: Router,

  ) {
  }

  ngAfterViewInit(): void {
    const tel = document.querySelector("#phoneNumberLogin");
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

  ngOnInit(): void {;
    this.invitationCode = this.route.snapshot.paramMap.get('invitationCode');
    this.unsubscribe.push(this.appService
      .post("user/check-invitation", {
        invitationCode: this.route.snapshot.paramMap.get('invitationCode')
      }, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.accountName = result.data.name;
          this.cdr.detectChanges();
        } else {
          this.hasError = true;
        }
      }));

    this.form1 = this.fb.group({
      verificationCode: [
        null
      ],
    });


  }

  back(){
    this.phoneEntered = false;
  }

  sendVerificationCode(){
    const s = this.appService
      .post(
        "user/accept-invitation-save",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          invitationCode: this.invitationCode,
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.phoneEntered = true;
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(s);

  }

  submit() {
    this.hasError = false;
    const s = this.appService
      .post(
        "user/accept-invitation-verify",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          verificationCode: this.form1.controls["verificationCode"].value
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.phoneVerified = true;
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
