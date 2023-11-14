import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardProviderComponent } from './dashboard-provider.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [DashboardProviderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardProviderComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class DashboardProviderModule {}
