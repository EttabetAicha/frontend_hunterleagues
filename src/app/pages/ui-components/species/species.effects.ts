import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SpeciesService } from '../../../services/species.service';
import * as SpeciesActions from './species.actions';

@Injectable()
export class SpeciesEffects {
  constructor(
    private actions$: Actions,
    private speciesService: SpeciesService
  ) {}

  loadSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpeciesActions.loadSpecies),
      mergeMap(() =>
        this.speciesService.getSpecies().pipe(
          map(species => SpeciesActions.loadSpeciesSuccess({ species })),
          catchError(error => of(SpeciesActions.loadSpeciesFailure({ error })))
        )
      )
    )
  );

  addSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpeciesActions.addSpecies),
      mergeMap(action =>
        this.speciesService.addSpecies(action.species).pipe(
          map(species => SpeciesActions.addSpeciesSuccess({ species })),
          catchError(error => of(SpeciesActions.addSpeciesFailure({ error })))
        )
      )
    )
  );

  deleteSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpeciesActions.removeSpecies),
      mergeMap(action =>
        this.speciesService.deleteSpecies(action.speciesId).pipe(
          map(() => SpeciesActions.removeSpeciesSuccess({ speciesId: action.speciesId })),
          catchError(error => of(SpeciesActions.removeSpeciesFailure({ error })))
        )
      )
    )
  );
}
