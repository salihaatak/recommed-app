import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard/recommender',
    loadChildren: () =>
      import('./dashboard-recommender/dashboard-recommender.module').then((m) => m.DashboardRecommenderModule),
  },
  {
    path: 'dashboard/provider',
    loadChildren: () =>
      import('./dashboard-provider/dashboard-provider.module').then((m) => m.DashboardProviderModule),
  },
  {
    path: 'me',
    data: { layout: 'dark-sidebar', section: 'me' },
    loadChildren: () =>
      import('./me/me.module').then((m) => m.AccountModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => {
      console.log("1");
      return import('../modules/account/account.module').then((m) => m.AccountModule) },

    data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
    data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
