import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URI} from "../api/api.js";

export const fetchLanguages = createAsyncThunk(
    'languages/fetchLanguages',
    async (_, { getState }) => {
        const language = getState().language.currentLanguage;
        const response = await axios.get(`${API_URI}/languages?lang=${language}`);
        return response.data;
    }
);

const getLanguages = createSlice({
    name: 'languages',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLanguages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLanguages.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchLanguages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default getLanguages.reducer;
