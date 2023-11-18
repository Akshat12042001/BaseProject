import {createAsyncThunk} from '@reduxjs/toolkit';

export const loginRequest = createAsyncThunk(
  'auth/loginRequest',
  async (_, thunkAPI) => {
    try {
      return {};
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const logoutRequest = createAsyncThunk(
  'auth/logoutRequest',
  async (_, thunkAPI) => {
    try {
      return {};
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);
