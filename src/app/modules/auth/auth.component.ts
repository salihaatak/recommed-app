import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    // BODY_CLASSES.forEach((c) => document.body.classList.add(c));
    switch (localStorage.getItem('role')){
      case 'u':
      case 'o':
        this.router.navigate([this.appService.getDashboardRoute()]);
        break;
      case 'r':
        this.router.navigate([this.appService.getDashboardRoute()]);
        break;
    }

  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
