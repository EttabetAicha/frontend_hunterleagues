import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './user.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectUserById = (userId: string) => createSelector(
  selectUsersState,
  (state: UsersState) => state.users.find(user => user.id === userId)
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: UsersState) => state.error
);
