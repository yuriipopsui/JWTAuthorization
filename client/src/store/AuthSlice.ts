import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../services/AuthService';
import { AuthResponse } from '../models/response/AuthResponse';
import { IAuthState } from '../models/IAuthState';
import { IUserData } from '../models/IUserData';

const storedUser = localStorage.getItem('user');

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem('token');
      
      if(!token || !storedUser) {
        return rejectWithValue('No token found');
      }
      const response = await AuthService.checkAuth();
      if (!response) {
        return rejectWithValue('Authentication response is undefined');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: IUserData, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);

      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registration = createAsyncThunk(
  'auth/registration',
  async ({email, password}: IUserData, {rejectWithValue}) => {
    try {
      const response = await AuthService.registration(email, password);

      console.log(response);

      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message  || 'Logout failed');
    }
  }
);

const initialState: IAuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) =>{
    builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(registration.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registration.fulfilled, (state, action: PayloadAction<AuthResponse>) =>{
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(registration.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(checkAuth.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload;
      console.log(state.user);
      state.isAuthenticated = true;
    })
    .addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    })
  },
});

export const {resetError} = authSlice.actions;
export default authSlice.reducer;
