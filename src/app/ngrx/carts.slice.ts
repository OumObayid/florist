import {
  createAction,
  props,
  createReducer,
  on,
  createSelector,
  createFeatureSelector,
} from '@ngrx/store';
import { CartItem } from '../interfaces/cartItem';

const isBrowser = typeof window !== 'undefined';

// -------------------- Interface et État ----------------------
export interface CartState {
  items: CartItem[];
  paymentMode: string;
  address?: string;
}

export const initialCartState: CartState = {
  items:
    isBrowser && localStorage.getItem('items')
      ? JSON.parse(localStorage.getItem('items')!)
      : [],
  paymentMode:
    isBrowser && localStorage.getItem('paymentMode')
      ? JSON.parse(localStorage.getItem('paymentMode')!)
      : null,
  address:
    isBrowser && localStorage.getItem('address')
      ? JSON.parse(localStorage.getItem('address')!)
      : null,
};
// -------------------- Actions -------------------------------
export const setCartItems = createAction(
  '[Cart] Set Items',
  props<{ items: CartItem[] }>()
);
export const addCartItem = createAction(
  '[Cart] Add Item',
  props<{ item: CartItem }>()
);
export const updateCartItemQuantity = createAction(
  '[Cart] Update Item Quantity',
  props<{ itemId: number; quantity: number }>()
);
export const removeCartItem = createAction(
  '[Cart] Remove Item',
  props<{ itemId: number }>()
);

export const clearCartItems = createAction('[Cart] Clear cart items');

export const setAddress = createAction(
  '[Cart] Set Address',
  props<{ address: string }>()
);
export const setPaymentMode = createAction(
  '[Cart] Set Payment Mode',
  props<{ paymentMode: string }>()
);

// -------------------- Reducer -------------------------------
export const cartReducer = createReducer(
  initialCartState,
 on(setCartItems, (state, { items }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('items', JSON.stringify(items));
  }
  return { ...state, items }; // ← ici
}),
  // on(setCartItems, (state, { items }) => ({ ...state, items })),
  on(addCartItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
  })),
  on(updateCartItemQuantity, (state, { itemId, quantity }) => ({
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    ),
  })),
  on(removeCartItem, (state, { itemId }) => ({
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  })),
  // ✅ Vider le panier
  on(clearCartItems, (state) => {
    if (isBrowser) {
      localStorage.removeItem('items');
    }
    return { ...state, items: [] };
  }), 
  on(setAddress, (state, { address }) => ({ ...state, address })),
  on(setPaymentMode, (state, { paymentMode }) => ({ ...state, paymentMode }))
);

// -------------------- Sélecteurs -----------------------------
const selectCartFeature = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartFeature,
  (state) => state.items
);
export const selectPaymentMode = createSelector(
  selectCartFeature,
  (state) => state.paymentMode
);
export const selectAddress = createSelector(
  selectCartFeature,
  (state) => state.address
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.prix * item.quantity, 0)
);
