import { createAction, props } from '@ngrx/store';

export const loadSpecies = createAction('[Species] Load Species');

export const loadSpeciesSuccess = createAction(
  '[Species] Load Species Success',
  props<{ species: any[] }>()
);

export const loadSpeciesFailure = createAction(
  '[Species] Load Species Failure',
  props<{ error: any }>()
);

export const addSpecies = createAction(
  '[Species] Add Species',
  props<{ species: any }>()
);

export const addSpeciesSuccess = createAction(
  '[Species] Add Species Success',
  props<{ species: any }>()
);

export const addSpeciesFailure = createAction(
  '[Species] Add Species Failure',
  props<{ error: any }>()
);

export const removeSpecies = createAction(
  '[Species] Remove Species',
  props<{ speciesId: string }>()
);

export const removeSpeciesSuccess = createAction(
  '[Species] Remove Species Success',
  props<{ speciesId: string }>()
);

export const removeSpeciesFailure = createAction(
  '[Species] Remove Species Failure',
  props<{ error: any }>()
);
