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
export interface OrdersState {
  orders: Order[];
}

const isBrowser = typeof window !== 'undefined';

export const initialOrdersState: OrdersState = {
  orders:
    isBrowser && localStorage.getItem('orders')
      ? JSON.parse(localStorage.getItem('orders')!)
      : [],
};

// -------------------- Actions ----------------------
export const setOrders = createAction(
  '[Orders] Set Orders',
  props<{ orders: Order[] }>()
);

export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: Order }>()
);

export const removeOrder = createAction(
  '[Orders] Remove Order',
  props<{ orderId: number }>()
);

export const clearOrders = createAction('[Orders] Clear Orders');

// -------------------- Reducer ----------------------
export const ordersReducer = createReducer(
  initialOrdersState,

  on(setOrders, (state, { orders }) => {
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
    return { ...state, orders };
  }),

  on(addOrder, (state, { order }) => {
    const updatedOrders = [...state.orders, order];
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
    return { ...state, orders: updatedOrders };
  }),

  on(removeOrder, (state, { orderId }) => {
    const updatedOrders = state.orders.filter((o) => o.id !== orderId);
    if (isBrowser) {
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
    return { ...state, orders: updatedOrders };
  }),

  on(clearOrders, () => {
    if (isBrowser) {
      localStorage.removeItem('orders');
    }
    return { orders: [] };
  })
);

// -------------------- Sélecteurs ----------------------
const selectOrdersFeature = createFeatureSelector<OrdersState>('orders');

export const selectOrders = createSelector(
  selectOrdersFeature,
  (state) => state.orders
);

export const selectOrdersCount = createSelector(
  selectOrdersFeature,
  (state) => state.orders.length
);

export const selectLatestOrder = createSelector(
  selectOrdersFeature,
  (state) => (state.orders.length ? state.orders[state.orders.length - 1] : null)
);
