import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService } from '../../../services/user-service.service';
import * as UsersActions from './user.actions';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.userService.searchUsers({}, 0, 10).pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      mergeMap(action =>
        this.userService.addUser(action.user).pipe(
          map(user => UsersActions.addUserSuccess({ user })),
          catchError(error => of(UsersActions.addUserFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(action =>
        this.userService.updateUser(action.user).pipe(
          map(user => UsersActions.updateUserSuccess({ user })),
          catchError(error => of(UsersActions.updateUserFailure({ error })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(action =>
        this.userService.deleteUser(action.userId).pipe(
          map(() => UsersActions.deleteUserSuccess({ userId: action.userId })),
          catchError(error => of(UsersActions.deleteUserFailure({ error })))
        )
      )
    )
  );
}
