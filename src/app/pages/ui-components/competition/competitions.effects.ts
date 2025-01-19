import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CompetitionService } from '../../../services/competition.service';
import * as CompetitionsActions from './competitions.actions';

@Injectable()
export class CompetitionsEffects {
  constructor(
    private actions$: Actions,
    private CompetitionService: CompetitionService
  ) {}

  loadCompetitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.loadCompetitions),
      mergeMap(() =>
        this.CompetitionService.getCompetitions().pipe(
          map(competitions => CompetitionsActions.loadCompetitionsSuccess({ competitions })),
          catchError(error => of(CompetitionsActions.loadCompetitionsFailure({ error })))
        )
      )
    )
  );

  addCompetition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.addCompetition),
      mergeMap(action =>
        this.CompetitionService.addCompetition(action.competition).pipe(
          map(competition => CompetitionsActions.addCompetitionSuccess({ competition })),
          catchError(error => of(CompetitionsActions.addCompetitionFailure({ error })))
        )
      )
    )
  );

  updateCompetition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.updateCompetition),
      mergeMap(action =>
        this.CompetitionService.updateCompetition(action.competition).pipe(
          map(competition => CompetitionsActions.updateCompetitionSuccess({ competition })),
          catchError(error => of(CompetitionsActions.updateCompetitionFailure({ error })))
        )
      )
    )
  );

  deleteCompetition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.deleteCompetition),
      mergeMap(action =>
        this.CompetitionService.deleteCompetition(action.competitionId).pipe(
          map(() => CompetitionsActions.deleteCompetitionSuccess({ competitionId: action.competitionId })),
          catchError(error => of(CompetitionsActions.deleteCompetitionFailure({ error })))
        )
      )
    )
  );
}
