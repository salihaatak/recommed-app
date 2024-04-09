import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, first } from 'rxjs';
import { AppService } from 'src/app/modules/auth';
import { AccountModel } from 'src/app/modules/auth/models/account.model';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-account-detail',
  templateUrl: './detail.component.html',
})
export class AccountDetailComponent implements OnInit, OnDestroy {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  form1: FormGroup;
  private account: AccountModel;

  constructor(
    private cdr: ChangeDetectorRef,
    public formBuilder1: FormBuilder,
    public appService: AppService,
    private router: Router,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {
    this.form1 = this.formBuilder1.group(
      {
        name: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ]),
        ],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(20),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(20),
          ]),
        ],
        salesRewardGranted: [false, Validators.compose([Validators.required])],
        salesRewardModel: ['pe', Validators.compose([Validators.required])],
        salesRewardPercentage: [
          '0',
          Validators.compose([
            Validators.required,
          ]),
        ],
        salesRewardAmount: [
          '0',
          Validators.compose([
            Validators.required,
          ]),
        ],
        salesRewardPeriod: [
          '0',
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
    );
    const s = this.appService
      .post('account/me')
      .subscribe((result: ApiResultModel | undefined) => {
        this.account = result?.data;
        this.form1.setValue({
          name: this.account.name,
          phoneNumber: this.account.phoneNumber,
          email: this.account.email,
          salesRewardGranted: this.account.salesRewardGranted,
          salesRewardModel: this.account.salesRewardModel,
          salesRewardAmount: this.account.salesRewardAmount,
          salesRewardPercentage: this.account.salesRewardPercentage,
          salesRewardPeriod: this.account.salesRewardPeriod,
        })
      });
    this.unsubscribe.push(s);
  }

  save() {
    this.hasError = false;
    const s = this.appService
      .post(
        'account/update',
        {
          name: this.form1.controls["name"].value,
          phoneNumber: this.form1.controls["phoneNumber"].value,
          email: this.form1.controls["email"].value,
          salesRewardGranted: this.form1.controls["salesRewardGranted"].value,
          salesRewardModel: this.form1.controls["salesRewardModel"].value,
          salesRewardPercentage: this.form1.controls["salesRewardPercentage"].value,
          salesRewardAmount: this.form1.controls["salesRewardAmount"].value,
          salesRewardPeriod: this.form1.controls["salesRewardPeriod"].value,
        }
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.appService.me().subscribe(()=>{
            this.router.navigate([this.appService.getDashboardRoute()]);
          })
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
