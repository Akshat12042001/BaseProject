import {createSlice} from '@reduxjs/toolkit';
import {loginRequest, logoutRequest} from './auth.action';

const INITIAL_STATE = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = null;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginRequest.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(logoutRequest.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(logoutRequest.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(logoutRequest.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {reset, setUserData, setIsLoggedIn} = authSlice.actions;

export default authSlice.reducer;
