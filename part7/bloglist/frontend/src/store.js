
import notificationsReducer from "./reducers/notificationsReducer";
import { configureStore } from "@reduxjs/toolkit"
import blogsReducer from "./reducers/blogsReducer";
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        notification: notificationsReducer,
        blogs: blogsReducer,
        user: userReducer
    }
});

export default store;