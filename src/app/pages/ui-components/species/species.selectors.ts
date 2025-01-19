export const selectAllSpecies = (state: any) => state.species.speciesList;

export const selectSpeciesById = (speciesId: string) => (state: any) =>
  state.species.speciesList.find((species: any) => species.id === speciesId);

export const selectSpeciesLoading = (state: any) => state.species.loading;

export const selectSpeciesError = (state: any) => state.species.error;
