import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: null,
    reducers: {
        setNotification: (message, type, duration = 5) => {
            return async (dispatch) => {
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: { message, type },
                });

                setTimeout(() => {
                    dispatch({ type: "CLEAR_NOTIFICATION" });
                }, duration * 1000);
            };
        }

    }
})

export const { setNotification } = notificationsSlice.actions;


export default notificationsSlice.reducer;
