// ----------------------- Imports ------------------------------
import {
  createAction,
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { Categorie } from '../interfaces/categorie';
import { Order } from '../interfaces/order';
// ------------------- Interface de l'état data ----------------
export interface DataState {
  products: Product[];
  users: User[];
  categories: Categorie[];
   orders: Order[]; 
}

// ------------------- État initial -----------------------------
const initialState: DataState = {
  products: [],
  users: [],
  categories: [],
   orders: []
};

// ----------------------- Actions -------------------------------

// ---------- Produits ----------
export const setProducts = createAction(
  '[Products] set Products',
  (payload: Product[]) => ({ payload })
);
export const updateProduct = createAction(
  '[Products] update product',
  (payload: Product) => ({ payload })
);
export const addProduct = createAction(
  '[Products] Add Product',
  (payload: Product) => ({ payload })
);
export const deleteProduct = createAction(
  '[Product] delete product',
  (id: number) => ({ payload: id })
);
export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  (payload: Product[]) => ({ payload })
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  (payload: string) => ({ payload })
);

// ---------- Utilisateurs ----------
export const setUsers = createAction(
  '[Users] set users',
  (payload: User[]) => ({ payload })
);
export const deleteUser = createAction('[User] delete user', (id: number) => ({
  payload: id,
}));
export const updateRoleUser = createAction(
  '[Users] Update role user',
  (id: number, role: string) => ({ payload: { id, role } })
);
// ---------- Catégories ----------
export const getCategories = createAction(
  '[Categories] set categories',
  (payload: Categorie[]) => ({ payload })
);
export const deleteCategory = createAction(
  '[Category] delete category',
  (id: number) => ({ payload: id })
);
export const addCategory = createAction(
  '[Category] Add category',
  (id: number, nom: string, description: string, image: string) => ({
    payload: { id, nom, description, image },
  })
);
export const updateCategory = createAction(
  '[Category] Update Category',
  (payload: Categorie) => ({ payload })
);
// ---------- Orders ----------
export const setAllOrders = createAction(
  '[Orders] Set All Orders',
  (orders: Order[]) => ({ payload: orders })
);

export const updateStatusOrder = createAction(
  '[Orders] Update Status',
  (id: number, status: Order['status']) => ({ payload: { id, status } })
);

// ---------------------- Reducer -------------------------------
export const dataReducer = createReducer(
  initialState,
  // ---------- Produits ----------
  on(setProducts, (state, { payload }) => ({ ...state, products: payload })),
  on(updateProduct, (state, { payload }) => ({
    ...state,
    products: state.products.map((prod) =>
      prod.id === payload.id ? { ...payload } : prod
    ),
  })),
  on(addProduct, (state, { payload }) => ({
    ...state,
    products: [...state.products, payload],
  })),
  on(deleteProduct, (state, { payload }) => ({
    ...state,
    products: state.products.filter((product) => product.id != payload),
  })),

  // ---------- Catégories ----------
  on(updateCategory, (state, { payload }) => ({
    ...state,
    categories: state.categories.map((cat) =>
      cat.id === payload.id ? { ...payload } : cat
    ),
  })),
  on(getCategories, (state, { payload }) => ({
    ...state,
    categories: payload,
  })),
  on(deleteCategory, (state, { payload }) => ({
    ...state,
    categories: state.categories.filter((category) => category.id != payload),
  })),
  on(addCategory, (state, { payload }) => ({
    ...state,
    categories: [...state.categories, payload],
  })),

  // ---------- Utilisateurs ----------
  on(setUsers, (state, { payload }) => ({ ...state, users: payload })),
  on(deleteUser, (state, { payload }) => ({
    ...state,
    users: state.users.filter((user) => user.id !== payload),
  })),
  on(updateRoleUser, (state, { payload }) => ({
  ...state,
  users: state.users.map(user =>
    user.id === payload.id ? { ...user, role: payload.role } : user
  )
})),
// ---------- Orders ----------
 on(setAllOrders, (state, { payload }) => ({
    ...state,
    orders: payload,
  })),
  on(updateStatusOrder, (state, { payload }) => ({
    ...state,
    orders: state.orders.map(order =>
      order.id === payload.id ? { ...order, status: payload.status } : order
    ),
  })),
);

// ---------------------- Sélecteurs ----------------------------
export const selectDataState = createFeatureSelector<DataState>('data');

export const selectProducts = createSelector(
  selectDataState,
  (state) => state.products
);

export const selectUsers = createSelector(
  selectDataState,
  (state) => state.users
);

export const selectCategories = createSelector(
  selectDataState,
  (state) => state.categories
);

export const selectAllOrders = createSelector(
  selectDataState,
  (state) => state.orders
);