import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, first } from 'rxjs';
import { AppService } from 'src/app/modules/auth';
import { AccountModel } from 'src/app/modules/auth/models/account.model';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-account-download',
  templateUrl: './download.component.html',
})
export class AccountDownloadComponent implements OnInit, OnDestroy {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  form1: FormGroup;
  private account: AccountModel;
  public sent: boolean = false;

  constructor(
    public formBuilder1: FormBuilder,
    public appService: AppService,
    ) {
  }

  ngOnInit(): void {
    this.form1 = this.formBuilder1.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ]),
        ],
      },
    );
  }

  submit() {
    this.hasError = false;
    if (this.form1.controls["email"].value) {
      const s = this.appService
        .post(
          'account/download-data',
          {
            email: this.form1.controls["email"].value
          }
        )
        .subscribe((result: ApiResultModel | undefined) => {
          if (result?.success) {
            this.appService.me().subscribe(()=>{
              this.sent = true;
            })
          } else {
            this.hasError = true;
          }
        });
      this.unsubscribe.push(s);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
