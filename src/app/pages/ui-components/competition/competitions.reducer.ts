import { createReducer, on } from '@ngrx/store';
import * as CompetitionsActions from './competitions.actions';

export interface CompetitionsState {
  competitions: any[];
  loading: boolean;
  error: any;
}

export const initialState: CompetitionsState = {
  competitions: [],
  loading: false,
  error: null
};

export const competitionsReducer = createReducer(
  initialState,
  on(CompetitionsActions.loadCompetitions, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CompetitionsActions.loadCompetitionsSuccess, (state, { competitions }) => ({
    ...state,
    competitions,
    loading: false
  })),
  on(CompetitionsActions.loadCompetitionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CompetitionsActions.addCompetition, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CompetitionsActions.addCompetitionSuccess, (state, { competition }) => ({
    ...state,
    competitions: [...state.competitions, competition],
    loading: false
  })),
  on(CompetitionsActions.addCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CompetitionsActions.updateCompetition, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CompetitionsActions.updateCompetitionSuccess, (state, { competition }) => ({
    ...state,
    competitions: state.competitions.map(c => c.id === competition.id ? competition : c),
    loading: false
  })),
  on(CompetitionsActions.updateCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CompetitionsActions.deleteCompetition, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CompetitionsActions.deleteCompetitionSuccess, (state, { competitionId }) => ({
    ...state,
    competitions: state.competitions.filter(c => c.id !== competitionId),
    loading: false
  })),
  on(CompetitionsActions.deleteCompetitionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
