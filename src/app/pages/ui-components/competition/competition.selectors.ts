export const selectAllCompetitions = (state: any) => state.competitions.competitions;

export const selectCompetitionById = (competitionId: string) => (state: any) =>
  state.competitions.competitions.find((competition: any) => competition.id === competitionId);

export const selectCompetitionsLoading = (state: any) => state.competitions.loading;

export const selectCompetitionsError = (state: any) => state.competitions.error;
