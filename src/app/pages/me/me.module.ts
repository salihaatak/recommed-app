import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { MeRoutingModule } from './me-routing.module';
import { AccountDetailComponent } from './account/detail/detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountComponent,
    AccountDetailComponent
  ],
  imports: [
    MeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule {
  constructor () {
    console.log("module yüklendi");
  }
 }
