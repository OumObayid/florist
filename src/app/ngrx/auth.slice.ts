// ----------------------- Imports ------------------------------
import {
  createAction,
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { User } from '../interfaces/user';

// ------------------- Interface de l'état auth ----------------
export interface AuthState {
  isLoggedIn: boolean;
  userInfoConnecter: User | null;
  role: string | null;
}

// ------------------- État initial -----------------------------
const initialState: AuthState = {
  isLoggedIn:
    typeof window !== 'undefined' &&
    localStorage.getItem('isLoggedIn') === 'true',

  role:
    typeof window !== 'undefined' && localStorage.getItem('role')
      ? localStorage.getItem('role')
      : null,

  userInfoConnecter:
    typeof window !== 'undefined' && localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
};

// ----------------------- Actions -------------------------------
export const setActiveUser = createAction('[Auth] Set Active User');
export const removeActiveUser = createAction('[Auth] Remove Active User');
export const getActiveUserInfo = createAction(
  '[User] Get Active User Info',
  (payload: User) => ({ payload })
);
export const setUserRole = createAction(
  '[Auth] Set User Role',
  (payload: string) => ({ payload })
);

// ---------------------- Reducer -------------------------------
export const authReducer = createReducer(
  initialState,
  on(setActiveUser, (state) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
    }
    return { ...state, isLoggedIn: true };
  }),
  on(removeActiveUser, (state) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
    return { ...state, isLoggedIn: false, userInfoConnecter: null };
  }),
  on(getActiveUserInfo, (state, { payload }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(payload));
    }
    return { ...state, userInfoConnecter: payload };
  }),

  on(setUserRole, (state, { payload }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('role', payload);
    }
    return { ...state, role: payload };
  })
);

// ---------------------- Sélecteurs ----------------------------
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.isLoggedIn
);

export const selectUserInfoConnecter = createSelector(
  selectAuthState,
  (state) => state.userInfoConnecter
);

export const selectUserRole = createSelector(
  selectAuthState,
  (state) => state.role
);
