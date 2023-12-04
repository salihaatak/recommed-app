import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'l',
    loadChildren: () =>
      import('./modules/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: 'me',
    canActivate: [AuthGuard],
    loadChildren: () => {
      return import('./_metronic/layout/layout.module').then((m) => m.LayoutModule);
    }
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => {
      return import('./_metronic/layout/layout.module').then((m) => m.LayoutModule);
    }
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
