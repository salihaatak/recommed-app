import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegistrationEmailVerificationComponent } from './components/registration-email-verification/email-verification.component';
import { RegistrationPhoneVerificationComponent } from './components/registration-phone-verification/phone-verification.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { IntroComponent } from './components/intro/intro.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { RecommenderRegistrationComponent } from './components/recommender-registration/recommender-registration.component';
import { RecommenderPhoneVerificationComponent } from './components/recommender-phone-verification/recommender-phone-verification.component';

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
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
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
        path: 'recommender/registration',
        component: RecommenderRegistrationComponent,
      },
      {
        path: 'recommender/registration/:invitationCode',
        component: RecommenderRegistrationComponent,
      },
      {
        path: 'recommender/phone-verification',
        component: RecommenderPhoneVerificationComponent,
      },
      {
        path: 'account/registration',
        component: RegistrationComponent,
      },
      {
        path: 'account/registration-email-verification',
        component: RegistrationEmailVerificationComponent,
      },
      {
        path: 'account/registration-phone-verification',
        component: RegistrationPhoneVerificationComponent,
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
