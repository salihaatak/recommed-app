import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { MeRoutingModule } from './me-routing.module';
import { AccountDetailComponent } from './account/detail/detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/detail/detail.component';
import { TranslationModule } from 'src/app/modules/i18n';
import { AccountDownloadComponent } from './account/download/download.component';


@NgModule({
  declarations: [
    AccountComponent,
    AccountDetailComponent,
    AccountDownloadComponent,
    UserComponent,
    UserDetailComponent,
  ],
  imports: [
    MeRoutingModule,
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule {
  constructor () {
    console.log("module yüklendi");
  }
 }
