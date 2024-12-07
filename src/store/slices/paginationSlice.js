import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPage: 1,
    itemsPerPage: 12,
    itemsPerPage2: 6,
};

const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetPage: (state) => {
            state.currentPage = 1;
        },
    },
});

export const { setPage, resetPage } = paginationSlice.actions;
export default paginationSlice.reducer;
