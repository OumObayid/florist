import { provideStore } from '@ngrx/store';
import { dataReducer } from './data.slice';
import { authReducer } from './auth.slice';
import { cartReducer } from './carts.slice';
import { ordersReducer } from './orders.slice';

export const appStore = provideStore({
  data: dataReducer,
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer
});