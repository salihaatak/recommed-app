import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, first } from 'rxjs';
import { AppService } from 'src/app/modules/auth';
import { AccountModel } from 'src/app/modules/auth/models/account.model';
import { ApiResultModel } from 'src/app/modules/auth/models/api-result.mode';

@Component({
  selector: 'app-user-detail',
  templateUrl: './detail.component.html',
})
export class UserDetailComponent implements OnInit, OnDestroy {
  hasError: boolean;
  private unsubscribe: Subscription[] = [];
  form1: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    public formBuilder1: FormBuilder,
    public appService: AppService,
    private router: Router,
    ) {
  }

  ngOnInit(): void {
    this.form1 = this.formBuilder1.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
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
      },
    );
    const s = this.appService
      .post('user/me')
      .subscribe((result: ApiResultModel | undefined) => {
        this.form1.setValue({
          firstName: result?.data.user.firstName,
          lastName: result?.data.user.lastName,
          phoneNumber: result?.data.user.phoneNumber,
        })
      });
    this.unsubscribe.push(s);
  }

  save() {
    this.hasError = false;
    const s = this.appService
      .post(
        'user/update',
        {
          firstName: this.form1.controls["firstName"].value,
          lastName: this.form1.controls["lastName"].value,
          phoneNumber: this.form1.controls["phoneNumber"].value,
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

  delete() {
    this.hasError = false;
    this.unsubscribe.push(this.appService
      .post(
        'user/delete-me'
      )
      .subscribe((result: ApiResultModel | undefined) => {
        if (result?.success) {
          this.appService.logout()
        } else {
          this.hasError = true;
        }
      }));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
