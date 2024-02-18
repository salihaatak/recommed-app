import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/modules/auth';
import { ApiResultModel } from '../../models/api-result.mode';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent implements OnInit, OnDestroy {
  hasError: boolean;
  returnUrl: string;
  accountName: any;
  invitationCode: string | null;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) {
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
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
