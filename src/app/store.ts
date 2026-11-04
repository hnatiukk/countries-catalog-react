import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { countriesReducer } from '@/features/countries/countriesSlice';

const rootReducer = combineReducers({
  countries: countriesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
