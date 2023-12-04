import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/modules/auth';

@Component({
  selector: 'app-invite-thanks',
  templateUrl: './invite-thanks.component.html',
  styleUrls: ['./invite-thanks.component.scss'],
})
export class InviteThanksComponent implements OnInit, OnDestroy {
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private appService: AppService,
  ) {

    this.isLoading$ = this.appService.isLoading$;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
