
import notificationsReducer from "./reducers/notificationsReducer";
import { configureStore } from "@reduxjs/toolkit"
import blogsReducer from "./reducers/blogsReducer";
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
    reducer: {
        notification: notificationsReducer,
        blogs: blogsReducer,
        user: userReducer,
        users: usersReducer
    }
});

export default store;