const initialState = null;

export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_NOTIFICATION":
            return action.payload;
        case "CLEAR_NOTIFICATION":
            return null;
        default:
            return state;
    }
};

export const setNotification = (message, type, duration = 5) => {
    return async (dispatch) => {
        dispatch({
            type: "SET_NOTIFICATION",
            payload: { message, type },
        });

        setTimeout(() => {
            dispatch({ type: "CLEAR_NOTIFICATION" });
        }, duration * 1000);
    };
};


export default notificationsReducer;
