import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { PublicGuard } from 'src/app/guard/PublicGuard.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
        canActivate: [PublicGuard]
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
        canActivate: [PublicGuard]
      }
    ],
  },
];
