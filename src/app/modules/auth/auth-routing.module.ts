import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { AccountRegistrationComponent } from './components/account-registration/account-registration.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AccountRegistrationPhoneVerificationComponent } from './components/account-registration-phone-verification/account-registration-phone-verification.component';
import { IntroComponent } from './components/intro/intro.component';
import { InvitationComponent } from './components/invitation/invitation.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: IntroComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'recommender/invitation',
        component: InvitationComponent,
      },
      {
        path: 'account/registration',
        component: AccountRegistrationComponent,
      },
      {
        path: 'account/registration-phone-verification',
        component: AccountRegistrationPhoneVerificationComponent,
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
export class AuthRoutingModule {}
