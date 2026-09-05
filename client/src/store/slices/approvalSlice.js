import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { createQuotationThunk } from './quotationSlice';

// Async Thunk to fetch all approval requests
export const fetchApprovalsThunk = createAsyncThunk(
  'approvals/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/approvals');
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Failed to fetch approval queue');
      return rejectWithValue(err.message || 'Failed to fetch approvals');
    }
  }
);

// Async Thunk to fetch a single approval detail by ID
export const fetchApprovalByIdThunk = createAsyncThunk(
  'approvals/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/approvals/${id}`);
      return res.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to fetch approval details');
      return rejectWithValue(err.message || 'Failed to fetch approval');
    }
  }
);

// Async Thunk to process approval action (APPROVE, REJECT, REVISION)
export const processApprovalThunk = createAsyncThunk(
  'approvals/processAction',
  async ({ id, action, note }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/approvals/${id}/action`, { action, note });
      toast.success(res.data.message || `Approval action ${action} completed!`);
      return { id, action, updatedQuote: res.data.data };
    } catch (err) {
      toast.error(err.message || 'Failed to process approval action');
      return rejectWithValue(err.message || 'Failed to process action');
    }
  }
);

const initialState = {
  counts: {
    pending: 3,
    returned: 1,
    approved: 12
  },
  activeApproval: {
    _id: 'q-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Gold',
    salesRep: 'Surjeet Kumar',
    totalAmount: 2970,
    discountPercentage: 14,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    stage: 'Sales Manager',
    assignedTo: 'M. Shah',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Worst single line (8pt over) plus overall pattern across the order sets the blended score. One bad line is enough to require approval.',
    flaggedLines: [
      { line: 'Laptop (Hardware)', discountGiven: '12%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
      { line: 'Setup Service (Services)', discountGiven: '18%', limitAllowed: '10%', overBy: '8 pt OVER', status: 'OVER' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'ACTIVE', color: '#3B82F6' },
      { step: 3, label: 'Finance', status: 'PENDING', color: '#94A3B8' },
      { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
    ],
    auditTrail: [
      { user: 'J. Rao', action: 'Submitted', date: 'Aug 20', note: 'Initial 12% discount' },
      { user: 'M. Shah', action: 'Returned', date: 'Aug 21', note: 'Requested justification' },
      { user: 'J. Rao', action: 'Resubmitted', date: 'Aug 22', note: 'Added margin note' }
    ]
  },
  items: [
    {
      _id: 'q-1042',
      quoteNumber: 'Q-1042',
      customerName: 'Acme Corp',
      customerTier: 'Gold',
      salesRep: 'Surjeet Kumar',
      totalAmount: 2970,
      discountPercentage: 14,
      riskScore: 18.5,
      riskLevel: 'HIGH',
      stage: 'Sales Manager',
      assignedTo: 'M. Shah',
      status: 'PENDING_APPROVAL',
      ceilingViolation: 'Worst single line (8pt over) plus overall pattern across the order sets the blended score. One bad line is enough to require approval.',
    },
    {
      _id: 'q-1039',
      quoteNumber: 'Q-1039',
      customerName: 'Beta Industries',
      customerTier: 'Gold',
      salesRep: 'Rahul Sharma',
      totalAmount: 28900,
      discountPercentage: 18,
      riskScore: 12.4,
      riskLevel: 'MEDIUM',
      stage: 'Finance',
      assignedTo: 'R. Iyer',
      status: 'REVISION_REQUESTED',
      ceilingViolation: 'Setup Service discount 18% returned by Finance for margin justification.',
    },
    {
      _id: 'q-1035',
      quoteNumber: 'Q-1035',
      customerName: 'Nova Retail',
      customerTier: 'Gold',
      salesRep: 'Priya Verma',
      totalAmount: 9750,
      discountPercentage: 10,
      riskScore: 5.5,
      riskLevel: 'LOW',
      stage: 'Auto-Approved',
      assignedTo: '-',
      status: 'APPROVED',
      ceilingViolation: null,
    }
  ],
  pendingOnlyFilter: false,
  loading: false,
  error: null,
};

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    togglePendingOnlyFilter: (state) => {
      state.pendingOnlyFilter = !state.pendingOnlyFilter;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Approvals List
      .addCase(fetchApprovalsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalsThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.items = action.payload.data;
        }
        if (action.payload.counts) {
          state.counts = action.payload.counts;
        }
      })
      .addCase(fetchApprovalsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Approval By ID
      .addCase(fetchApprovalByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovalByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeApproval = action.payload;
      })
      .addCase(fetchApprovalByIdThunk.rejected, (state) => {
        state.loading = false;
      })

      // Process Approval Action
      .addCase(processApprovalThunk.fulfilled, (state, action) => {
        const { id, updatedQuote } = action.payload;
        if (state.activeApproval && state.activeApproval._id === id) {
          state.activeApproval = updatedQuote;
        }
        const target = state.items.find((item) => item._id === id);
        if (target) {
          target.status = updatedQuote.status;
          target.stage = updatedQuote.stage || target.stage;
          if (updatedQuote.auditTrail) target.auditTrail = updatedQuote.auditTrail;
        }
        state.counts.pending = state.items.filter((i) => i.status === 'PENDING_APPROVAL').length;
        state.counts.returned = state.items.filter((i) => i.status === 'REVISION_REQUESTED').length;
        state.counts.approved = state.items.filter((i) => i.status === 'APPROVED').length;
      })

      // Real-time synchronization when a quotation is created that needs approval
      .addCase(createQuotationThunk.fulfilled, (state, action) => {
        if (action.payload.status === 'PENDING_APPROVAL') {
          state.items.unshift({
            ...action.payload,
            stage: 'Sales Manager',
            assignedTo: 'M. Shah'
          });
          state.counts.pending += 1;
        }
      });
  },
});

export const { togglePendingOnlyFilter } = approvalSlice.actions;
export default approvalSlice.reducer;
