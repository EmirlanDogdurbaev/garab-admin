import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "../api/api.js";

export const fetchAllCollections = createAsyncThunk(
    'collections/fetchAllCollections',
    async (_, {getState}) => {
        const language = getState().language.currentLanguage;
        const response = await axios.get((
            `${API_URI}/collections?lang=${language}`
        ))
        return response.data
    }
)

export const collectionsSlice = createSlice({
    name: 'collections',
    initialState: {
        collections: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCollections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCollections.fulfilled, (state, action) => {
                state.loading = false;
                state.collections = action.payload;
            })
            .addCase(fetchAllCollections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});


export default collectionsSlice.reducer;
