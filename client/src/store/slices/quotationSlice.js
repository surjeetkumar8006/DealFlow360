import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { processApprovalThunk } from './approvalSlice';

// Async Thunk to fetch all quotations
export const fetchQuotationsThunk = createAsyncThunk(
  'quotation/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/quotations');
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to load quotations');
      return rejectWithValue(err.message || 'Failed to load quotations');
    }
  }
);

// Async Thunk to fetch a single quotation by ID
export const fetchQuotationByIdThunk = createAsyncThunk(
  'quotation/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/quotations/${id}`);
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to load quotation detail');
      return rejectWithValue(err.message || 'Failed to load quotation');
    }
  }
);

// Async Thunk to create a new quotation
export const createQuotationThunk = createAsyncThunk(
  'quotation/create',
  async (quotationData, { rejectWithValue }) => {
    try {
      const res = await api.post('/quotations', quotationData);
      toast.success(res.data.message || 'Quotation created successfully!');
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create quotation');
      return rejectWithValue(err.message || 'Failed to create quotation');
    }
  }
);

// Async Thunk to update quotation status / draft
export const updateQuotationStatusThunk = createAsyncThunk(
  'quotation/updateStatus',
  async ({ id, status, lineItems, customerName, priceList }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/quotations/${id}/status`, { status, lineItems, customerName, priceList });
      toast.success(res.data.message || `Quotation updated!`);
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
      return rejectWithValue(err.message || 'Failed to update status');
    }
  }
);

// Async Thunk to delete a quotation
export const deleteQuotationThunk = createAsyncThunk(
  'quotation/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/quotations/${id}`);
      toast.success(res.data.message || 'Quotation deleted successfully!');
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to delete quotation');
      return rejectWithValue(err.message || 'Failed to delete quotation');
    }
  }
);

const initialState = {
  activeQuotation: null,
  quotationsList: [],
  viewMode: 'BOARD',
  loading: false,
  error: null,
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'BOARD' ? 'TABLE' : 'BOARD';
    },
    updateActiveLineDiscount: (state, action) => {
      const { lineId, discount } = action.payload;
      if (!state.activeQuotation || !state.activeQuotation.lineItems) return;
      const item = state.activeQuotation.lineItems.find((l) => l.id === lineId);
      if (item) {
        item.discount = Number(discount) || 0;
      }
    },
    addUpsellToActiveQuotation: (state, action) => {
      const { product, price, discount = 0, limit = 15 } = action.payload;
      if (!state.activeQuotation) return;
      if (!state.activeQuotation.lineItems) state.activeQuotation.lineItems = [];
      state.activeQuotation.lineItems.push({
        id: `l-upsell-${Date.now()}`,
        product,
        qty: 1,
        price,
        discount,
        limit
      });
      toast.success(`Added ${product} to quotation!`);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchQuotationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quotationsList = action.payload;
      })
      .addCase(fetchQuotationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch By ID
      .addCase(fetchQuotationByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuotationByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeQuotation = action.payload;
      })
      .addCase(fetchQuotationByIdThunk.rejected, (state) => {
        state.loading = false;
      })

      // Create Quotation
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        state.quotationsList.unshift(action.payload);
        state.activeQuotation = action.payload;
      })

      // Update Quotation Status / Draft
      .addCase(updateQuotationStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.activeQuotation = updated;
        const index = state.quotationsList.findIndex((q) => q._id === updated._id);
        if (index !== -1) {
          state.quotationsList[index] = updated;
        }
      })

      // Delete Quotation
      .addCase(deleteQuotationThunk.fulfilled, (state, action) => {
        const { id, quoteNumber } = action.payload || {};
        state.quotationsList = state.quotationsList.filter(
          (q) => String(q._id) !== String(id) && String(q.id) !== String(id) && q.quoteNumber !== quoteNumber
        );
        if (
          state.activeQuotation &&
          (String(state.activeQuotation._id) === String(id) ||
            String(state.activeQuotation.id) === String(id) ||
            state.activeQuotation.quoteNumber === quoteNumber)
        ) {
          state.activeQuotation = null;
        }
      })

      // Real-time update when an approval is processed by Manager
      .addCase(processApprovalThunk.fulfilled, (state, action) => {
        const { id, updatedQuote } = action.payload;
        if (state.activeQuotation && state.activeQuotation._id === id) {
          state.activeQuotation.status = updatedQuote.status;
        }
        const target = state.quotationsList.find((q) => q._id === id);
        if (target) {
          target.status = updatedQuote.status;
          target.managerNote = updatedQuote.managerNote;
        }
      });
  }
});

export const { toggleViewMode, updateActiveLineDiscount, addUpsellToActiveQuotation } = quotationSlice.actions;
export default quotationSlice.reducer;
