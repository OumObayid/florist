import {
  createAction,
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Categorie } from '../interfaces/categorie';

// Interface pour l'état global
export interface DataState {
  isLoggedIn: boolean;
  userInfoConnecter: User | null;
  products: Product[];
  users: User[];
  categories: Categorie[];
  role: string | null; // Ajout du rôle
}

// État initial
const initialState: DataState = {
  //user info
  isLoggedIn:
    typeof window !== 'undefined' &&
    localStorage.getItem('isLoggedIn') === 'true',
  
//role 
  role:
  typeof window !== 'undefined' && localStorage.getItem('role')
    ? localStorage.getItem('role')
    : null,
    //user connecté
  userInfoConnecter:
    typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null,
  //products
  products: [],
  //users
  users: [],
  //categorie
  categories: [],
};

// -----------------------Actions-------------------------------
//isLoggedIn
export const setActiveUser = createAction('[Auth] Set Active User');
export const removeActiveUser = createAction('[Auth] Remove Active User');
export const getActiveUserInfo = createAction(
  '[User] Get Active User Info',
  (payload: User) => ({ payload })
);
//product
export const setProducts = createAction(
  '[Products] set Products',
  (payload: Product[]) => ({ payload })
);
//update product
export const updateProduct = createAction(
  '[Products] update product',
  (payload: Product) => ({ payload })
);
// Add Product
export const addProduct = createAction(
  '[Products] Add Product',
  (payload: Product) => ({ payload })
);
//delete Product
export const deleteProduct = createAction(
  '[Product] delete product',
  (id: number) => ({ payload: id })
);
// Dans la section des actions
export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  (payload: Product[]) => ({ payload })
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  (payload: string) => ({ payload })
);
/////////////////////////////////////////////***USER***/////////////////
//role
export const setUserRole = createAction(
  '[Auth] Set User Role',
  (payload: string) => ({ payload })
);

//users
export const setUsers = createAction(
  '[Users] set users',
  (payload: User[]) => ({ payload })
);
export const deleteUser = createAction(
  '[User] delete user', (id: number) => ({
  payload: id,
}));
//////////////////////////////////////
//categories
export const getCategories = createAction(
  '[Categories] set categories',
  (payload: Categorie[]) => ({ payload })
);
//delete category
export const deleteCategory = createAction(
  '[Category] delete category',
  (id: number) => ({ payload: id })
);
//add category
export const addCategory=createAction(
  '[Category] Add category',
  (id: number, nom: string) => ({ payload: { id, nom } })
);
//Update category
export const updateCategory = createAction(
  '[Category] Update Category',
  (payload: Categorie) => ({ payload })
);

// ----------------------Reducers-------------------------------
export const dataReducer = createReducer(
  initialState,
  //isLoggedIn  Mettre à jour localStorage
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
  on(setUserRole, (state, { payload }) => {
    console.log('setUserRole - payload :', payload);
    if (typeof window !== 'undefined') {
      localStorage.setItem('role', payload);
    }
    return { ...state, role: payload };
  }),
  
  on(getActiveUserInfo, (state, { payload }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(payload));
    }
    return { ...state, userInfoConnecter: payload };
  }),

  ////////////////////////////////////Product
  //All product
  on(setProducts, (state, { payload }) => {
    // console.log("Produits enregistrés dans le store:", payload);
    return {
      ...state,
      products: payload,
    };
  }),
  // Updat product
  on(updateProduct, (state, { payload }) => {
    console.log('Produit mis à jour:', payload);
    return {
      ...state,
      products: state.products.map((prod) =>
        prod.id === payload.id ? { ...payload } : prod
      ),
    };
  }),

  // AddProduct
  on(addProduct, (state, { payload }) => {
    return {
      ...state,
      products: [...state.products, payload], 
    };
  }),
  
  //delete category
  on(deleteProduct, (state, { payload }) => {
    return {
      ...state,
      products: state.products.filter((product) => product.id != payload),
    };
  }),
  on(updateCategory, (state, { payload }) => ({
    ...state,
    categories: state.categories.map(cat =>
      cat.id === payload.id ? { ...payload } : cat
    ),
  })),
  ///////////////////////////////////////////
  //get users
  on(setUsers, (state, { payload }) => {
    return {
      ...state,
      users: payload,
    };
  }),
  //delete user
  on(deleteUser, (state, { payload }) => {
    return {
      ...state,
      users: state.users.filter((user) => user.id !== payload),
    };
  }),
  //get Categories
  on(getCategories, (state, { payload }) => {
    return {
      ...state,
      categories: payload,
    };
  }),
  //delete category
  on(deleteCategory, (state, { payload }) => {
    return {
      ...state,
      categories: state.categories.filter((category) => category.id != payload),
    };
  }),
  // Add Category
  on(addCategory, (state, { payload }) => ({
    ...state,
    categories: [...state.categories, { id: payload.id, nom: payload.nom }]
  })),
  
);

// Sélecteurs
export const selectDataState = createFeatureSelector<DataState>('data');
export const selectIsLoggedIn = createSelector(
  selectDataState,
  (state) => state.isLoggedIn
);
export const selectUserInfoConnecter = createSelector(
  selectDataState,
  (state) => state.userInfoConnecter
);
// export const selectProducts = createSelector(
//   selectDataState,
//   (state) => state.products
// );
export const selectProducts = createSelector(selectDataState, (state) => {
  // console.log("Sélecteur selectProducts retourne:", state.products);
  return state.products;
});
export const selectUsers = createSelector(selectDataState, (state) => {
  return state.users;
});
export const selectCategories = createSelector(selectDataState, (state) => {
  return state.categories;
});
export const selectUserRole = createSelector(
  selectDataState,
  (state) => {
    console.log('Sélecteur selectUserRole - state.role :', state.role);
    return state.role;
  }
);

