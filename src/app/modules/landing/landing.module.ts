import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { TranslationModule } from '../i18n/translation.module';
import { InviteComponent } from './components/invite/invite.component';
import { RecommendComponent } from './components/recommend/recommend.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecommendThanksComponent } from './components/recommend-thanks/recommend-thanks.component';

@NgModule({
  declarations: [
    RecommendComponent,
    InviteComponent,
    RecommendThanksComponent,
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
