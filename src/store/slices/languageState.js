import { createSlice } from '@reduxjs/toolkit';

const languageState = createSlice({
    name: 'language',
    initialState: {
        currentLanguage: 'ru'
    },
    reducers: {
        setLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        }
    }
});

export const { setLanguage } = languageState.actions;
export default languageState.reducer;