import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, first } from 'rxjs';
import { AppService } from 'src/app/modules/auth';
import { AccountModel } from 'src/app/modules/auth/models/account.model';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './wallet.component.html',
})
export class UserWalletComponent implements OnInit, OnDestroy {
  form1: FormGroup;
  public proceeded: boolean = false;

  constructor(
    public formBuilder1: FormBuilder,
    public appService: AppService,
    ) {
  }

  ngOnInit(): void {
    this.proceeded = false;
    this.form1 = this.formBuilder1.group(
      {
        encryptionKey: [
          localStorage.getItem("encryptionKey"),
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
    if (this.form1.controls["encryptionKey"].value) {
      localStorage.setItem("encryptionKey", this.form1.controls["encryptionKey"].value);
      this.proceeded = true;
    }
  }

  ngOnDestroy() {
  }
}
