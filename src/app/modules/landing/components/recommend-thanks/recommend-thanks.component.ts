import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/modules/auth';

@Component({
  selector: 'app-recommend-thanks',
  templateUrl: './recommend-thanks.component.html',
  styleUrls: ['./recommend-thanks.component.scss'],
})
export class RecommendThanksComponent implements OnInit, OnDestroy {
  hasError: boolean;
  returnUrl: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private appService: AppService,
  ) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
