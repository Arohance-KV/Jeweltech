import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL ='https://jewel-tech.onrender.com';

// Async Thunks
export const requestOTP = createAsyncThunk(
  'user/requestOTP',
  async ({ isdCode, phoneNumber }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isdCode, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to request OTP');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'user/verifyOTP',
  async ({ isdCode, phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isdCode, phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to verify OTP');
      }

      // Store token in localStorage
      if (data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch profile');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to update profile');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  accessToken: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  phoneNumber: null,
  isdCode: null,
  userStatus: null, // 'pending_details' | 'pending' | 'active'
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.userStatus = null;
      state.phoneNumber = null;
      state.isdCode = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    // Request OTP
    builder
      .addCase(requestOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        state.userStatus = action.payload.status;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.userStatus = action.payload.status;
        state.phoneNumber = action.payload.phoneNumber;
        state.isdCode = action.payload.isdCode;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.userStatus = action.payload.status;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = userSlice.actions;
export default userSlice.reducer;