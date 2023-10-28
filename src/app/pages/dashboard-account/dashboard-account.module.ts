import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent as DashboardAccountComponent } from './dashboard-account.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [DashboardAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardAccountComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
  ],
})
export class DashboardAccountModule {}
