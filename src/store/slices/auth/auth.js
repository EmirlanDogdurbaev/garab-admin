import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URI} from "../../api/api.js";

export const signup = createAsyncThunk('auth/register', async ({username, password}) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(`${API_URI}/register`, {username, password});
        const token = response.data.token;

        console.log(response.data)
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        return {username, token};
    } catch (error) {
        throw error;
    }
});


export const login = createAsyncThunk('auth/login', async ({password, username}) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(`${API_URI}/login`, {password, username});
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        return {username, token};
    } catch (error) {
        throw error;
    }
});


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('access_token') || null,
        email: localStorage.getItem('email') || null,
        status: '',
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('email');
            localStorage.removeItem('username');

            state.token = null;
            state.email = null;
            state.username = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.email = action.payload.email;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.email = action.payload.email;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

    },
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;