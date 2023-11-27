import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRecommenderComponent } from './dashboard-recommender.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { TranslationModule } from 'src/app/modules/i18n';

@NgModule({
  declarations: [DashboardRecommenderComponent],
  imports: [
    CommonModule,
    TranslationModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardRecommenderComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class DashboardRecommenderModule {}
