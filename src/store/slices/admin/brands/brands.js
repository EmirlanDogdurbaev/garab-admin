import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "../../../api/api.js";

export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URI}/brands`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

export const fetchBrandsById = createAsyncThunk(
    'brands/fetchBrandsById',
    async (id, {rejectWithValue}) => {
        try {
            console.log(id)
            const response = await axios.get(`${API_URI}/brand?brand_id=${id}`);
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

// Thunk для создания бренда
export const createBrand = createAsyncThunk(
    "brands/createBrand",
    async ({name, photo}, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("photo", photo);

            const response = await axios.post(`${API_URI}/brand`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const updateBrand = createAsyncThunk(
    "brands/updateBrand",
    async ({brandId, name, photo}, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (photo) {
                formData.append("photo", photo);
            }

            const response = await axios.put(`${API_URI}/brand?id=${brandId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const deleteBrand = createAsyncThunk(
    "brands/deleteBrand",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URI}/brand`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                data: { id: id },
            });

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error:", error.response || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);





export const brands = createSlice({
    name: "brands",
    initialState: {
        brands: [],
        brand: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrandsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrandsById.fulfilled, (state, action) => {
                state.loading = false;
                state.brand = action.payload;
            })
            .addCase(fetchBrandsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload); // Добавляем новый бренд
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBrand = action.payload;
                state.brands = state.brands.map((brand) =>
                    brand.id === updatedBrand.id ? updatedBrand : brand
                );
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = state.brands.filter((item) => item.id !== action.payload.id)

            })

    }
})

export default brands.reducer;

