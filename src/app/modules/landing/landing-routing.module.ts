import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { InviteComponent } from './components/invite/invite.component';
import { RecommendComponent } from './components/recommend/recommend.component';
import { RecommendThanksComponent } from './components/recommend-thanks/recommend-thanks.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: 'i/:invitationCode',
        component: InviteComponent,
      },
      {
        path: 'r/thanks',
        component: RecommendThanksComponent,
      },
      {
        path: 'r/:recommenderUid/:encryptionKey',
        component: RecommendComponent,
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
