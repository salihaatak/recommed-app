import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRecommenderComponent } from './dashboard-recommender.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [DashboardRecommenderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardRecommenderComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
  ],
})
export class DashboardRecommenderModule {}
