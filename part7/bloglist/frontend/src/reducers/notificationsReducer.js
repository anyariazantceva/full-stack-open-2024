import { createSlice } from "@reduxjs/toolkit";

let timeoutId;

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: null,
    reducers: {
        setNotificationContent: (state, action) => {
            return action.payload;
        },

        clearNotification() {
            return null;
        },
    }
})

export const setNotification = (message, type, duration = 5) => {
    return (dispatch) => {
        // clear any previous timeouts
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        dispatch(setNotificationContent({ message, type }));

        timeoutId = setTimeout(() => {
            dispatch(clearNotification());
        }, duration * 1000);
    };
};

export const { setNotificationContent, clearNotification } = notificationsSlice.actions;


export default notificationsSlice.reducer;
