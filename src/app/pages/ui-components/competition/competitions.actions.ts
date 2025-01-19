import { createAction, props } from '@ngrx/store';

export const loadCompetitions = createAction('[Competitions] Load Competitions');

export const loadCompetitionsSuccess = createAction(
  '[Competitions] Load Competitions Success',
  props<{ competitions: any[] }>()
);

export const loadCompetitionsFailure = createAction(
  '[Competitions] Load Competitions Failure',
  props<{ error: any }>()
);

export const addCompetition = createAction(
  '[Competitions] Add Competition',
  props<{ competition: any }>()
);

export const addCompetitionSuccess = createAction(
  '[Competitions] Add Competition Success',
  props<{ competition: any }>()
);

export const addCompetitionFailure = createAction(
  '[Competitions] Add Competition Failure',
  props<{ error: any }>()
);

export const updateCompetition = createAction(
  '[Competitions] Update Competition',
  props<{ competition: any }>()
);

export const updateCompetitionSuccess = createAction(
  '[Competitions] Update Competition Success',
  props<{ competition: any }>()
);

export const updateCompetitionFailure = createAction(
  '[Competitions] Update Competition Failure',
  props<{ error: any }>()
);

export const deleteCompetition = createAction(
  '[Competitions] Delete Competition',
  props<{ competitionId: string }>()
);

export const deleteCompetitionSuccess = createAction(
  '[Competitions] Delete Competition Success',
  props<{ competitionId: string }>()
);

export const deleteCompetitionFailure = createAction(
  '[Competitions] Delete Competition Failure',
  props<{ error: any }>()
);

export const registerParticipation = createAction(
  '[Competitions] Register Participation',
  props<{ userId: string, competitionId: string }>()
);

export const registerParticipationSuccess = createAction(
  '[Competitions] Register Participation Success',
  props<{ response: any }>()
);

export const registerParticipationFailure = createAction(
  '[Competitions] Register Participation Failure',
  props<{ error: any }>()
);

export const loadCompetitionPodium = createAction(
  '[Competitions] Load Competition Podium',
  props<{ competitionId: string }>()
);

export const loadCompetitionPodiumSuccess = createAction(
  '[Competitions] Load Competition Podium Success',
  props<{ podiumData: any[] }>()
);

export const loadCompetitionPodiumFailure = createAction(
  '[Competitions] Load Competition Podium Failure',
  props<{ error: any }>()
);
