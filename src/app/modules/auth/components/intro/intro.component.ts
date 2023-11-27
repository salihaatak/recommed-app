import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ApplicationRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, OnDestroy {
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.isLoading$ = this.appService.isLoading$;

    if (localStorage.getItem("token")){
      this.appService.me().subscribe(()=>{
        if (this.route.snapshot.queryParams['returnUrl']){
          this.router.navigate([this.route.snapshot.queryParams['returnUrl']]);
        } else {
          this.router.navigate([this.appService.getDashboardRoute()]);
        }
      })
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
