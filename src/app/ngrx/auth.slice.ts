/*
 * Projet Flower-Shop
 * Page : Auth NGRX Store
 *
 * Description :
 * Définit le store NgRx pour la gestion de l'authentification.
 * Contient l'état de connexion, les informations de l'utilisateur connecté,
 * le rôle de l'utilisateur, les actions pour gérer ces données,
 * le reducer pour appliquer les changements et les sélecteurs pour y accéder.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

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
  isLoggedIn: boolean; // Indique si l'utilisateur est connecté
  userInfoConnecter: User | null; // Informations de l'utilisateur connecté
  role: string | null; // Rôle de l'utilisateur
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
    typeof window !== 'undefined' &&
    localStorage.getItem('user') &&
    localStorage.getItem('user') !== 'undefined'
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
