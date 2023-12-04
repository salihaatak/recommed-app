import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { IntroComponent } from './components/intro/intro.component';
import { InviteComponent } from './components/invite/invite.component';
import { InviteThanksComponent } from './components/invite-thanks/invite-thanks.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        component: IntroComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'i/thanks',
        component: InviteThanksComponent,
      },
      {
        path: 'i/f/:recommenderUid',
        component: InviteComponent,
      },
      //{ path: '', redirectTo: 'login', pathMatch: 'full' },
      //{ path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
