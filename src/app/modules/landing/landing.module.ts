import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { TranslationModule } from '../i18n/translation.module';
import { IntroComponent } from './components/intro/intro.component';
import { InviteComponent } from './components/invite/invite.component';
import { TranslateModule } from '@ngx-translate/core';
import { InviteThanksComponent } from './components/invite-thanks/invite-thanks.component';

@NgModule({
  declarations: [
    InviteComponent,
    IntroComponent,
    InviteThanksComponent,
    LandingComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    LandingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: []
})
export class LandingModule {}
