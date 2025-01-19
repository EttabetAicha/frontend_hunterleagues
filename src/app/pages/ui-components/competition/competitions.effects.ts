import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CompetitionService } from '../../../services/competition.service';
import { ParticipationService } from 'src/app/services/Participation.service';
import * as CompetitionsActions from './competitions.actions';

@Injectable()
export class CompetitionsEffects {
  constructor(
    private actions$: Actions,
    private competitionService: CompetitionService,
    private participationService: ParticipationService
  ) {}

  loadCompetitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.loadCompetitions),
      mergeMap(() =>
        this.competitionService.getCompetitions().pipe(
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
        this.competitionService.addCompetition(action.competition).pipe(
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
        this.competitionService.updateCompetition(action.competition).pipe(
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
        this.competitionService.deleteCompetition(action.competitionId).pipe(
          map(() => CompetitionsActions.deleteCompetitionSuccess({ competitionId: action.competitionId })),
          catchError(error => of(CompetitionsActions.deleteCompetitionFailure({ error })))
        )
      )
    )
  );

  registerParticipation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.registerParticipation),
      mergeMap(action =>
        this.participationService.registerParticipation({ userId: action.userId, competitionId: action.competitionId }).pipe(
          map(response => CompetitionsActions.registerParticipationSuccess({ response })),
          catchError(error => of(CompetitionsActions.registerParticipationFailure({ error })))
        )
      )
    )
  );

  loadCompetitionPodium$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompetitionsActions.loadCompetitionPodium),
      mergeMap(action =>
        this.participationService.getCompetitionPodium(action.competitionId).pipe(
          map(podiumData => CompetitionsActions.loadCompetitionPodiumSuccess({ podiumData })),
          catchError(error => of(CompetitionsActions.loadCompetitionPodiumFailure({ error })))
        )
      )
    )
  );
}
