import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeQuotation: {
    quoteNumber: 'Q-1021',
    customerName: 'Beta Industries',
    customerTier: 'GOLD',
    items: [],
    subtotal: 0,
    discountAmount: 0,
    totalAmount: 0,
    overallMarginPercent: 22.5,
    blendedRiskScore: 0,
    requiredApprovalLevel: 'NONE',
  },
  quotationsList: [],
  loading: false,
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      state.activeQuotation.items.push(action.payload);
    },
    removeItemFromCart: (state, action) => {
      state.activeQuotation.items = state.activeQuotation.items.filter(item => item.id !== action.payload);
    },
    updateLineDiscount: (state, action) => {
      const { itemId, discountPercent } = action.payload;
      const item = state.activeQuotation.items.find(i => i.id === itemId);
      if (item) {
        item.discountPercent = discountPercent;
      }
    },
    setQuotationRiskScore: (state, action) => {
      state.activeQuotation.blendedRiskScore = action.payload.score;
      state.activeQuotation.requiredApprovalLevel = action.payload.level;
    }
  }
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateLineDiscount,
  setQuotationRiskScore
} = quotationSlice.actions;

export default quotationSlice.reducer;
