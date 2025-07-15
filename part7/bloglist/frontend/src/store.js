import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import notificationsReducer from "./reducers/notificationsReducer";
import blogsReducer from "./reducers/blogsReducer";

const reducer = combineReducers({
    notification: notificationsReducer,
    blogs: blogsReducer
    // ...other reducers
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;