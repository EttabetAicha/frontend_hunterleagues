import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { UserComponent } from './users/user.component';
import { SpeciesComponent } from './species/species.component';
import { ParticipationComponent } from './participation/participation.component';
import { CompetitionComponent } from './competition/competition.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UserComponent,
      },
      {
        path:'species',
        component:SpeciesComponent
      },
      {
        path: 'competition',
        component: CompetitionComponent,
      },
      {
        path: 'participation',
        component: ParticipationComponent,
      },

      // {
      //   path: 'badge',
      //   component: AppBadgeComponent,
      // },
      // {
      //   path: 'chips',
      //   component: AppChipsComponent,
      // },
      // {
      //   path: 'lists',
      //   component: AppListsComponent,
      // },
      // {
      //   path: 'menu',
      //   component: AppMenuComponent,
      // },
      // {
      //   path: 'tooltips',
      //   component: AppTooltipsComponent,
      // },
      // {
      //   path: 'forms',
      //   component: AppFormsComponent,
      // },
      // {
      //   path: 'tables',
      //   component: AppTablesComponent,
      // },
    ],
  },
];
