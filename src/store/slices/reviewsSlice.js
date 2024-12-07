import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "../api/api.js";

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async () => {
        const response = await axios.get(`${API_URI}/reviews`);

        return response.data;
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (data, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URI}/reviews`, data)
         
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Обработка создания отзыва
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                // Добавляем новый отзыв в массив данных
                state.data = [...state.data, action.payload];
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    }
});

export default reviewsSlice.reducer;
