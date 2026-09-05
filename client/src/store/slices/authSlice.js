import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Async Thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('df360_token', token);
      toast.success(`Welcome back, ${userData.name}! Logged in as ${userData.role.replace('_', ' ').toUpperCase()}`, { id: 'login-success' });
      return { token, user: userData };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role, companyName }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role, companyName });
      const { token, ...userData } = res.data;
      localStorage.setItem('df360_token', token);
      toast.success(`Account created successfully! Logged in as ${userData.role.replace('_', ' ').toUpperCase()}`, { id: 'register-success' });
      return { token, user: userData };
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('df360_token');
      if (!token) return rejectWithValue('No token found');
      const res = await api.get('/auth/me');
      return { token, user: res.data };
    } catch (err) {
      localStorage.removeItem('df360_token');
      return rejectWithValue('Token verification failed');
    }
  }
);

export const switchRoleDemoThunk = createAsyncThunk(
  'auth/switchRoleDemo',
  async (targetRole, { dispatch, rejectWithValue }) => {
    const roleAccounts = {
      sales_rep: { email: 'sales@dealflow360.com', password: 'password123' },
      sales_manager: { email: 'manager@dealflow360.com', password: 'password123' },
      finance: { email: 'finance@dealflow360.com', password: 'password123' },
      admin: { email: 'admin@dealflow360.com', password: 'password123' },
      customer: { email: 'customer@example.com', password: 'password123' },
    };

    const creds = roleAccounts[targetRole];
    if (!creds) return rejectWithValue('Invalid role key');

    try {
      toast.loading(`Authenticating as ${targetRole.replace('_', ' ').toUpperCase()}...`, { id: 'role-switch' });
      await api.post('/auth/seed-demo').catch(() => {});
      const result = await dispatch(loginThunk(creds)).unwrap();
      toast.dismiss('role-switch');
      return result;
    } catch (err) {
      toast.dismiss('role-switch');
      return rejectWithValue(err.message || 'Demo role switch failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('df360_token') || null,
  role: '',
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('df360_token');
      state.user = null;
      state.token = null;
      state.role = '';
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      toast.success('Successfully logged out of DealFlow360', { id: 'logout-success' });
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role || '';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role || '';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role || '';
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.role = '';
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
