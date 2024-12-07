import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "../../api/api.js";


export const searchByCategory = createAsyncThunk(
    'search/searchByCategory',
    async (categoryId, {getState, dispatch, rejectWithValue}) => {
        try {
            dispatch(clearResults());
            const language = getState().language.currentLanguage;
            const response = await axios.get(`${API_URI}/items?category_id=${categoryId}&lang=${language}`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

export const searchByInputValue = createAsyncThunk(
    'products/searchByInputValue',
    async (inputValue, {getState, dispatch, rejectWithValue}) => {
        try {
            dispatch(clearResults()); // Очистка результатов перед выполнением нового поиска
            const language = getState().language.currentLanguage;
            const response = await axios.get(`${API_URI}/search?lang=${language}&q=${inputValue}`);
            return [...response.data.collections, ...response.data.items];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);


export const searchByPriceRange = createAsyncThunk(
    'products/searchByPriceRange',
    async (priceRange, {getState, dispatch, rejectWithValue}) => {
        try {
            dispatch(clearResults());
            const language = getState().language.currentLanguage;
            const response = await axios.get(`${API_URI}/search?lang=${language}&price_min=${priceRange.min}&price_max=${priceRange.max}`);
            return [...response.data.collections, ...response.data.items];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

export const fetchByProducerIsPainted = createAsyncThunk(
    'products/fetchByProducerIsPainted',
    async (_, {getState, dispatch, rejectWithValue}) => {
        try {
            dispatch(clearResults());
            const language = getState().language.currentLanguage;
            const response = await axios.get(`${API_URI}/search?lang=${language}&is_producer=true&is_painted=true`,)

            return [...response.data.items, ...response.data.collections];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch data")
        }
    }
)

export const fetchByDistributivFilter = createAsyncThunk(
    'products/fetchByDistributiv',
    async (_, {getState, dispatch, rejectWithValue}) => {
        try {
            dispatch(clearResults());
            const language = getState().language.currentLanguage;
            const response = await axios.get(`${API_URI}/search?lang=${language}&is_producer=false`,)

            return [...response.data.items, ...response.data.collections];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch data")
        }
    }
)

export const fetchByProducerFilter = createAsyncThunk(
    'products/fetchByProducer',
    async (_, {getState}) => {
        const language = getState().language.currentLanguage;
        const response = await axios.get(`${API_URI}/search?lang=${language}&is_producer=true`,)

        return [...response.data.items, ...response.data.collections];
    }
)


const search = createSlice({
    name: "search",
    initialState: {
        results: [],
        status: "idle",
        error: null,
        filters: {
            category: null,
            priceRange: {min: 0, max: 10000},
            inputValue: '',
        },
    },
    reducers: {
        setInputValue(state, action) {
            state.filters.inputValue = action.payload;
        },
        setFilterCategory: (state, action) => {
            state.filters.category = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.priceRange = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {category: null, priceRange: {min: 0, max: 10000}, inputValue: ''};
        },
        clearResults: (state) => {
            state.results = [];
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchByCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(searchByCategory.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(searchByCategory.rejected, (state, action) => {
                state.error = action.payload || "Error fetching category data";
                state.status = "failed";
            })
            .addCase(searchByInputValue.pending, (state) => {
                state.status = "loading";
            })
            .addCase(searchByInputValue.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(searchByInputValue.rejected, (state, action) => {
                state.error = action.payload || "No product found";
                state.status = "failed";
            })
            .addCase(searchByPriceRange.pending, (state) => {
                state.status = "loading";
            })
            .addCase(searchByPriceRange.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(searchByPriceRange.rejected, (state, action) => {
                state.error = action.payload || "Error fetching price range data";
                state.status = "failed";
            })
            .addCase(fetchByDistributivFilter.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchByDistributivFilter.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchByDistributivFilter.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(fetchByProducerFilter.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchByProducerFilter.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchByProducerFilter.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })
            .addCase(fetchByProducerIsPainted.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchByProducerIsPainted.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchByProducerIsPainted.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            });
    },
});

export const {setInputValue, setFilterCategory, setPriceRange, clearFilters, clearResults, clearError} = search.actions;

export default search.reducer;
