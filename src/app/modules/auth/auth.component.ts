import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // BODY_CLASSES.forEach((c) => document.body.classList.add(c));
    switch (localStorage.getItem('type')){
      case 'u':
        this.router.navigate(['/dashboard/account']);
        break;
      case 'r':
        this.router.navigate(['/dashboard/recommender']);
        break;
    }

  }

  ngOnDestroy() {
    // BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
  }
}
