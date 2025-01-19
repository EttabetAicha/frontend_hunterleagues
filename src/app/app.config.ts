import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';


import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


import { NgScrollbarModule } from 'ngx-scrollbar';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/AuthInterceptor.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './pages/ui-components/users/user.reducer';
import { competitionsReducer } from './pages/ui-components/competition/competitions.reducer';
import { speciesReducer } from './pages/ui-components/species/species.reducer';
import { UsersEffects } from './pages/ui-components/users/user.effects';
import { CompetitionsEffects } from './pages/ui-components/competition/competitions.effects';
import { SpeciesEffects } from './pages/ui-components/species/species.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
    }), withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimationsAsync(),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
    importProvidersFrom(FormsModule, ReactiveFormsModule, MaterialModule, TablerIconsModule.pick(TablerIcons), NgScrollbarModule),
    provideStore({
      users: usersReducer,
      competitions: competitionsReducer,
      species: speciesReducer
    }),
    provideEffects([UsersEffects, CompetitionsEffects, SpeciesEffects])
],
};
