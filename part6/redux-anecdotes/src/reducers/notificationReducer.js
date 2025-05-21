import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: "Check message",
    reducers: {
        test(state, action) {
            return action.payload
        }
    }
})

export const { test } = notificationsSlice.actions;

export default notificationsSlice.reducer;