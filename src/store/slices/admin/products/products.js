import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URI} from "../../../api/api.js";

export const fetchAllProducts = createAsyncThunk(
    'admin/products/fetchAllProducts',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URI}/items/all`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProductById = createAsyncThunk(
    'admin/products/deleteById',
    async (productId, {rejectWithValue}) => {
        try {
            const response = await axios.delete(`${API_URI}/items/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const allProductsSlice = createSlice({
    name: 'allProducts',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProductById.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item.id !== action.payload.id);
                state.loading = false;
            })
            .addCase(deleteProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

    }
})

export default allProductsSlice.reducer;
