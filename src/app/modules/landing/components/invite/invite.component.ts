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
  error: any;
  returnUrl: string;
  promotions: string[] | undefined;
  rewards: string[] | undefined;
  account: {
    name: string,
    logo: string,
    serviceImage: string,
    team: string,
    rewards: string,
    promotions: string
  } | null;
  invitationCode: string | null;
  recommendationUrl: string;
  phoneEntered: boolean = false;
  phoneVerified: boolean = false;
  phoneNumber: intlTelInput.Plugin;
  copied: boolean = false;

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

  renderPhoneNumber() {
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
  ngAfterViewInit(): void {
    this.renderPhoneNumber();
  }

  ngOnInit(): void {;
    this.invitationCode = this.route.snapshot.paramMap.get('invitationCode');
    this.unsubscribe.push(this.appService
      .post("account/get-by-invitation-code", {
        invitationCode: this.route.snapshot.paramMap.get('invitationCode')
      }, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.account = result.data;
          this.promotions = this.account?.promotions.split(';');
          this.rewards = this.account?.rewards.split(';');
          this.cdr.detectChanges();
        } else {
          this.error = result?.message;
        }
      }));

      this.form1 = this.fb.group({
        verificationCode: [
          null
        ],
        firstName: [
          null
        ],
        lastName: [
          null
        ],
      });


  }

  sendVerificationCode(){
    const s = this.appService
      .post(
        "user/accept-invitation-save",
        {
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          invitationCode: this.invitationCode,
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.phoneEntered = true;
          this.error = null;
        } else {
          this.error = result?.message;
        }
      });
    this.unsubscribe.push(s);
  }

  copy(){
    const inputElement = document.createElement('input');
    inputElement.value = this.recommendationUrl;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    this.copied = true;
  }

  submit() {
    this.error = null;
    const s = this.appService
      .post(
        "user/accept-invitation-verify",
        {
          invitationCode: this.invitationCode,
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
          verificationCode: this.form1.controls["verificationCode"].value,
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.phoneVerified = true;
          this.error = null;
          this.recommendationUrl = `https://www.recommed.co/app/l/r/${result.data.uid}`;
        } else {
          this.error = result?.message;
        }
      });
    this.unsubscribe.push(s);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
