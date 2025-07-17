import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from '../services/users'

export const initializeUsers = createAsyncThunk(
    'users/initializeUsers',
    async () => {
        const users = await usersService.getAll();
        return users;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers: (state, action) => {
            return action.payload
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeUsers.fulfilled, (_, action) => action.payload);
    }
})

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer