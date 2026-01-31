import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './Features/searchSlice';

export const store = configureStore({
  reducer: {
    search:searchReducer,
  },
});