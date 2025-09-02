/*
 * Projet Flower-Shop
 * Page : NgRx Store - Orders
 *
 * Description :
 * Définit le store NgRx pour la gestion des commandes.
 * Contient l'état initial des commandes, actions pour CRUD, le reducer et les sélecteurs pour accéder aux commandes.
 * Les commandes sont également persistées dans localStorage pour les sessions navigateur.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

// -------------------- Imports ----------------------
import {
  createAction,
  props,
  createReducer,
  on,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import { Order } from '../interfaces/order';

// -------------------- État ----------------------
// Interface représentant l'état des commandes dans le store
export interface OrdersState {
  orders: Order[];
}

// Vérifie si on est côté navigateur pour l'accès au localStorage
const isBrowser = typeof window !== 'undefined';

// État initial des commandes
export const initialOrdersState: OrdersState = {
  orders:
    isBrowser && localStorage.getItem('orders')
      ? JSON.parse(localStorage.getItem('orders')!)
      : [],
};

// -------------------- Actions ----------------------
// Définition des actions pour gérer les commandes

// Remplacer l'ensemble des commandes
export const setOrders = createAction(
  '[Orders] Set Orders',
  props<{ orders: Order[] }>()
);

// Ajouter une nouvelle commande
export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: Order }>()
);

// Supprimer une commande par son ID
export const removeOrder = createAction(
  '[Orders] Remove Order',
  props<{ orderId: number }>()
);

// Vider toutes les commandes
export const clearOrders = createAction('[Orders] Clear Orders');

// -------------------- Reducer ----------------------
// Création du reducer pour gérer les actions sur l'état des commandes
export const ordersReducer = createReducer(
  initialOrdersState,

  // Met à jour toutes les commandes et persiste dans localStorage
  on(setOrders, (state, { orders }) => {
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
    return { ...state, orders };
  }),

  // Ajoute une commande et met à jour localStorage
  on(addOrder, (state, { order }) => {
    const updatedOrders = [...state.orders, order];
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
    return { ...state, orders: updatedOrders };
  }),

  // Supprime une commande spécifique et met à jour localStorage
  on(removeOrder, (state, { orderId }) => {
    const updatedOrders = state.orders.filter((o) => o.id !== orderId);
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
    return { ...state, orders: updatedOrders };
  }),

  // Vide toutes les commandes et supprime du localStorage
  on(clearOrders, () => {
    if (isBrowser) {
      localStorage.removeItem('orders');
    }
    return { orders: [] };
  })
);

// -------------------- Sélecteurs ----------------------
// Sélecteurs pour accéder aux informations de commandes dans le store

// Sélecteur de la feature "orders"
const selectOrdersFeature = createFeatureSelector<OrdersState>('orders');

// Sélecteur pour obtenir toutes les commandes
export const selectOrders = createSelector(
  selectOrdersFeature,
  (state) => state.orders
);

// Sélecteur pour obtenir le nombre total de commandes
export const selectOrdersCount = createSelector(
  selectOrdersFeature,
  (state) => state.orders.length
);

// Sélecteur pour obtenir la dernière commande ajoutée
export const selectLatestOrder = createSelector(
  selectOrdersFeature,
  (state) => (state.orders.length ? state.orders[state.orders.length - 1] : null)
);
