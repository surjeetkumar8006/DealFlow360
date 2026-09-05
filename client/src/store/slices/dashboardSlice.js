import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { createQuotationThunk } from './quotationSlice';
import { processApprovalThunk } from './approvalSlice';

// Async Thunk to fetch Sales Dashboard Stats & Activity
export const fetchDashboardStatsThunk = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to sync live dashboard data');
      return rejectWithValue(err.message || 'Failed to load dashboard data');
    }
  }
);

const initialState = {
  stats: {
    pendingApprovals: 2,
    openQuotations: 3,
    atRiskDeals: 1,
  },
  recentActivity: [
    {
      id: 'act-1',
      title: 'Acme Corp quotation approved by Finance',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      type: 'APPROVAL',
      dotColor: '#2F6F5E',
    },
    {
      id: 'act-2',
      title: 'Beta Industries requested a discount change from the customer portal',
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      type: 'NEGOTIATION',
      dotColor: '#B8863B',
    },
    {
      id: 'act-3',
      title: 'East Depot stock updated for Order #2291',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      type: 'INVENTORY',
      dotColor: '#262B33',
    },
  ],
  discountTiers: [
    { tier: 'Bronze', maxDiscount: 5, color: '#B08D57' },
    { tier: 'Silver', maxDiscount: 10, color: '#B7BAC2' },
    { tier: 'Gold', maxDiscount: 15, color: '#B8863B' },
  ],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    refreshDashboardLocally: (state) => {
      toast.success('Dashboard metrics refreshed!', { id: 'dash-refresh' });
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
        state.discountTiers = action.payload.discountTiers;
      })
      .addCase(fetchDashboardStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Real-time synchronization when a new quotation is created
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        const newQuote = action.payload;
        state.stats.openQuotations += 1;

        if (newQuote.status === 'PENDING_APPROVAL') {
          state.stats.pendingApprovals += 1;
        }

        if (newQuote.riskLevel === 'HIGH') {
          state.stats.atRiskDeals += 1;
        }

        state.recentActivity.unshift({
          id: `act-${Date.now()}`,
          title: `${newQuote.customerName} quote (${newQuote.quoteNumber}) submitted — ${newQuote.status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Auto-Approved'}`,
          createdAt: new Date().toISOString(),
          type: newQuote.status === 'PENDING_APPROVAL' ? 'APPROVAL' : 'QUOTATION',
          dotColor: newQuote.status === 'PENDING_APPROVAL' ? '#B8863B' : '#2F6F5E',
        });
      })

      // Real-time synchronization when an approval action is taken
      .addCase(processApprovalThunk.fulfilled, (state, action) => {
        const { updatedQuote } = action.payload;
        state.stats.pendingApprovals = Math.max(0, state.stats.pendingApprovals - 1);

        state.recentActivity.unshift({
          id: `act-${Date.now()}`,
          title: `Quote ${updatedQuote.quoteNumber} (${updatedQuote.customerName}) marked as ${updatedQuote.status.toLowerCase()}`,
          createdAt: new Date().toISOString(),
          type: 'APPROVAL',
          dotColor: updatedQuote.status === 'APPROVED' ? '#2F6F5E' : '#9E2A2B',
        });
      });
  }
});

export const { refreshDashboardLocally } = dashboardSlice.actions;
export default dashboardSlice.reducer;
