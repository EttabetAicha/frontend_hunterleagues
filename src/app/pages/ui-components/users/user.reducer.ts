import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './user.actions';

export interface UsersState {
  users: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, state => ({ ...state, loading: true })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UsersActions.addUser, state => ({ ...state, loading: true })),
  on(UsersActions.addUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: [...state.users, user],
  })),
  on(UsersActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UsersActions.updateUser, state => ({ ...state, loading: true })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: state.users.map(u => u.id === user.id ? user : u),
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UsersActions.deleteUser, state => ({ ...state, loading: true })),
  on(UsersActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    loading: false,
    users: state.users.filter(user => user.id !== userId),
  })),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
