import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../auth';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
