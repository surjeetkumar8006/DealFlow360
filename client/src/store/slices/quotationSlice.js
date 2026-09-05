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

const initialState = {
  activeQuotation: {
    _id: 'q-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 2970,
    discountPercentage: 14,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Onsite Setup Service discount 18% exceeds line limit ceiling of 10% by 8 points.',
    lineItems: [
      { id: 'l-1', product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 12, limit: 15 },
      { id: 'l-2', product: 'Onsite Setup Service', qty: 1, price: 450, discount: 18, limit: 10 },
      { id: 'l-3', product: 'Extended Warranty', qty: 1, price: 180, discount: 10, limit: 15 }
    ],
  },
  quotationsList: [
    {
      _id: 'q-1042',
      quoteNumber: 'Q-1042',
      customerName: 'Acme Corp',
      customerTier: 'Silver',
      salesRep: 'Surjeet Kumar',
      priceList: 'Standard Enterprise 2026',
      totalAmount: 2970,
      discountPercentage: 14,
      riskScore: 18.5,
      riskLevel: 'HIGH',
      status: 'PENDING_APPROVAL',
      ceilingViolation: 'Onsite Setup Service discount 18% exceeds line limit ceiling of 10% by 8 points.',
      lineItems: [
        { id: 'l-1', product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 12, limit: 15 },
        { id: 'l-2', product: 'Onsite Setup Service', qty: 1, price: 450, discount: 18, limit: 10 },
        { id: 'l-3', product: 'Extended Warranty', qty: 1, price: 180, discount: 10, limit: 15 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'q-1001',
      quoteNumber: 'Q-1001',
      customerName: 'Acme Corp',
      customerTier: 'Silver',
      salesRep: 'Surjeet Kumar',
      priceList: 'Standard Enterprise 2026',
      totalAmount: 12400,
      discountPercentage: 8,
      riskScore: 4.2,
      riskLevel: 'LOW',
      status: 'DRAFT',
      lineItems: [{ id: 'l-10', product: 'Cloud Workstation License (Monthly)', qty: 10, price: 1240, discount: 8, limit: 15 }],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'q-1002',
      quoteNumber: 'Q-1002',
      customerName: 'Delta LLC',
      customerTier: 'Bronze',
      salesRep: 'Rahul Sharma',
      priceList: 'Standard Retail 2026',
      totalAmount: 3200,
      discountPercentage: 4,
      riskScore: 2.1,
      riskLevel: 'LOW',
      status: 'DRAFT',
      lineItems: [{ id: 'l-11', product: 'Standard Support Package', qty: 1, price: 3200, discount: 4, limit: 5 }],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      _id: 'q-1003',
      quoteNumber: 'Q-1003',
      customerName: 'Beta Industries',
      customerTier: 'Gold',
      salesRep: 'Rahul Sharma',
      priceList: 'Enterprise Partner 2026',
      totalAmount: 28900,
      discountPercentage: 18,
      riskScore: 18.5,
      riskLevel: 'HIGH',
      status: 'PENDING_APPROVAL',
      ceilingViolation: 'Setup Service discount given is 18% (Allowed Gold tier ceiling is 15%). Exceeds threshold by 3 points.',
      lineItems: [
        { id: 'l-12', product: 'Enterprise Server Node', qty: 1, price: 15000, discount: 15, limit: 15 },
        { id: 'l-13', product: 'Dedicated Migration Service', qty: 1, price: 13900, discount: 18, limit: 10 }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: 'q-1004',
      quoteNumber: 'Q-1004',
      customerName: 'Nova Retail',
      customerTier: 'Gold',
      salesRep: 'Priya Verma',
      priceList: 'Standard Retail 2026',
      totalAmount: 9750,
      discountPercentage: 10,
      riskScore: 5.5,
      riskLevel: 'LOW',
      status: 'APPROVED',
      lineItems: [{ id: 'l-14', product: 'POS Hardware Terminal', qty: 5, price: 1950, discount: 10, limit: 15 }],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      _id: 'q-1005',
      quoteNumber: 'Q-1005',
      customerName: 'Zenith Co',
      customerTier: 'Silver',
      salesRep: 'Surjeet Kumar',
      priceList: 'Standard Enterprise 2026',
      totalAmount: 15300,
      discountPercentage: 12,
      riskScore: 11.2,
      riskLevel: 'MEDIUM',
      status: 'NEGOTIATION',
      ceilingViolation: 'Portal negotiation active: Customer requested 12% discount.',
      lineItems: [{ id: 'l-15', product: 'Storage Array Appliance', qty: 2, price: 7650, discount: 12, limit: 10 }],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      _id: 'q-1006',
      quoteNumber: 'Q-1006',
      customerName: 'Orion Ltd',
      customerTier: 'Gold',
      salesRep: 'Priya Verma',
      priceList: 'Enterprise Partner 2026',
      totalAmount: 41000,
      discountPercentage: 15,
      riskScore: 9.8,
      riskLevel: 'MEDIUM',
      status: 'CONFIRMED',
      lineItems: [{ id: 'l-16', product: 'Data Center Infrastructure Bundle', qty: 1, price: 41000, discount: 15, limit: 15 }],
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
    }
  ],
  viewMode: 'BOARD', // 'BOARD' | 'TABLE'
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
