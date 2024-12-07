import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URI} from "../api/api.js";

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, {getState}) => {
        const language = getState().language.currentLanguage;
        const response = await axios.get(`${API_URI}/category?lang=${language}`);
        return response.data;
    }
);

export const fetchCategoriesById = createAsyncThunk(
    'categories/fetchCategoriesById',
    async (id, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URI}/category/by/id?category_id=${id}`);

            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
);
export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (categoryList, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                `${API_URI}/category`,
                {categories: categoryList},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axios.delete(
                `${API_URI}/category`, // No ID in the URL
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json", // Ensure the content type is set
                    },
                    data: {id}, // Pass the ID in the request body
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({id,categoryData}, {rejectWithValue}) => {
        try {
            const response = await axios.put(
                `${API_URI}/category?category_id=${id}`,
                categoryData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        selectedMeals: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategoriesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoriesById.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategoriesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(
                    (category) => category.id !== action.meta.arg
                );
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(updateCategory.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = "succeeded";

                if (Array.isArray(state.categories)) {
                    const index = state.categories.findIndex(
                        (category) => category.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.categories[index] = action.payload;
                    }
                } else {
                    state.categories = {
                        ...state.categories,
                        [action.payload.id]: action.payload,
                    };
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default categoriesSlice.reducer;