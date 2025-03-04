import { provideStore } from '@ngrx/store';
import { dataReducer } from './data.slice';

export const appStore = provideStore({
  data: dataReducer,
});