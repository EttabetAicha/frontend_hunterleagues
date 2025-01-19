import { createReducer, on } from '@ngrx/store';
import { addSpecies, removeSpecies, loadSpeciesSuccess } from './species.actions';

export interface SpeciesState {
  speciesList: any[];
}

export const initialState: SpeciesState = {
  speciesList: [],
};

export const speciesReducer = createReducer(
  initialState,
  on(loadSpeciesSuccess, (state, { species }) => ({
    ...state,
    speciesList: species,
  })),
  on(addSpecies, (state, { species }) => ({
    ...state,
    speciesList: [...state.speciesList, species],
  })),
  on(removeSpecies, (state, { speciesId }) => ({
    ...state,
    speciesList: state.speciesList.filter(species => species.id !== speciesId),
  }))
);
