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

export const fetchReviewsAdmin = createAsyncThunk(
    'reviews/fetchReviewsAdmin',
    async () => {
        const response = await axios.get(`${API_URI}/reviewsAdmin`);
        console.log(response.data);
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

export const toggle = createAsyncThunk(
    'reviews/toggle',
    async (id, {rejectWithValue}) => {

        console.log(id)
        console.log(`Bearer ${localStorage.getItem("token")}`)
        try {
            const response = await axios.post(`${API_URI}/switchIsShowReview`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                data: {id},
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const deleteReviewById = createAsyncThunk(
    "reviews/deleteReviewById",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axios.delete(`${API_URI}/reviews`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data: {id},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


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

            .addCase(fetchReviewsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchReviewsAdmin.rejected, (state, action) => {
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
            })

            .addCase(toggle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggle.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReviewId = action.payload.id; // ID обновленного отзыва
                const reviewIndex = state.reviews.findIndex(
                    (review) => review.id === updatedReviewId
                );
                if (reviewIndex !== -1) {
                    state.reviews[reviewIndex].isShow = action.payload.isShow;
                }
            })
            .addCase(toggle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Произошла ошибка";
            })

            .addCase(deleteReviewById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteReviewById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = state.data.filter(
                    (review) => review.id !== action.meta.arg
                );
            })
            .addCase(deleteReviewById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export default reviewsSlice.reducer;
