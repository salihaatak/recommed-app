import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardProviderComponent } from './dashboard-provider.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { TranslationModule } from 'src/app/modules/i18n';

@NgModule({
  declarations: [DashboardProviderComponent],
  imports: [
    CommonModule,
    TranslationModule,
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
