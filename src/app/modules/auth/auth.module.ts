import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AccountRegistrationComponent } from './components/account-registration/account-registration.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { AccountRegistrationPhoneVerificationComponent } from './components/account-registration-phone-verification/account-registration-phone-verification.component';
import { SocialLoginModule, GoogleSigninButtonModule, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { InvitationComponent } from './components/invitation/invitation.component';
import { IntroComponent } from './components/intro/intro.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    IntroComponent,
    InvitationComponent,
    LoginComponent,
    AccountRegistrationComponent,
    AccountRegistrationPhoneVerificationComponent,
    LogoutComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '162200197336-g3elt1qvgq6cqk3dkfkt5g3vdfd3t7be.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.log(err);
        },
      } as SocialAuthServiceConfig
    }

  ]
})
export class AuthModule {}
