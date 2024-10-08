import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, retry } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResultModel } from '../../models/api-result.mode';
import { AppService } from 'src/app/modules/auth';
import * as CryptoJS from 'crypto-js';
import * as intlTelInput from 'intl-tel-input';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { title } from 'process';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  error: any;
  promotions: string[] | undefined;
  recommender: {
    name: string,
    account: {
      name: string,
      logo: string,
      serviceImage: string,
      team: string,
      promotions: string
    }
  } | null;
  recommenderUid: string;
  phoneNumber: intlTelInput.Plugin;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpClient,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.recommenderUid = this.route.snapshot.paramMap.get('recommenderUid') || "";

    if (this.recommenderUid){
      const subscr = this.appService
      .post("user/get-recommender", {uid: this.recommenderUid}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.recommender = result.data;
          this.promotions = this.recommender?.account.promotions.split(';');
          this.titleService.setTitle(this.recommender?.account?.name ?? 'Referans Kampanyası');
        } else {
          this.error = result?.message;
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
        agree: [],
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
    this.error = null;
    if (!this.form1.controls["agree"].value) {
      this.error = 'Lütfen Kişisel Verileri Koruma Kanunu (KVKK) aydınlatma metnini onaylayınız';
      return false;
    }
    const s = this.appService
      .post(
        "recommendation/add-via-landing",
        {
          recommenderUid: this.recommenderUid,
          name: this.form1.controls["name"].value,
          phoneNumber: this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164),
        },
        false
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.router.navigate(['l/r/thanks']);
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
