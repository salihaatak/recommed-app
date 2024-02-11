import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';
import { AppService } from 'src/app/modules/auth';
import * as CryptoJS from 'crypto-js';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing-recommender',
  templateUrl: './recommender.component.html',
  styleUrls: ['./recommender.component.scss'],
})
export class LandingRecommenderComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean = false;
  accountName: string;
  accountUid: string;
  phoneNumber: intlTelInput.Plugin;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.accountUid = this.route.snapshot.paramMap.get('accountUid') || "";

    if (this.accountUid){
      const subscr = this.appService
      .post("account/get", {uid: this.accountUid}, false)
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
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        /*
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
          ]),
        ],
        */
        agree: [true, Validators.compose([Validators.required])],
      }
    );

    const tel = document.querySelector("#phoneNumber");
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
    this.hasError = false;
    const s = this.appService
      .post(
        "account/save-lead",
        {
          accountUid: this.accountUid,
          name: this.form1.controls["name"].value,
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['l/r/thanks']);
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
