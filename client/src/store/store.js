import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import quotationReducer from './slices/quotationSlice';
import dashboardReducer from './slices/dashboardSlice';
import approvalReducer from './slices/approvalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    quotation: quotationReducer,
    dashboard: dashboardReducer,
    approvals: approvalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
