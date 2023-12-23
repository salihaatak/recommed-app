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
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  hasError: boolean = false;
  recommenderName: string;
  recommenderUid: string;
  encryptionKey: string;
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
    this.recommenderUid = this.route.snapshot.paramMap.get('recommenderUid') || "";
    this.encryptionKey = this.route.snapshot.paramMap.get('encryptionKey') || "";

    if (this.recommenderUid && this.encryptionKey){
      const subscr = this.appService
      .post("user/get-recommender", {uid: this.recommenderUid}, false)
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.recommenderName = result.data.name;
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
        "user/recommend-via-landing",
        {
          recommenderUid: this.recommenderUid,
          name: this.form1.controls["name"].value,
          phoneNumber: CryptoJS.AES.encrypt(this.phoneNumber.getNumber(intlTelInputUtils.numberFormat.E164), this.encryptionKey).toString() ,
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
