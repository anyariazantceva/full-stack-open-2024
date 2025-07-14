import { createStore, combineReducers } from "redux";
import notificationsReducer from "./reducers/notificationsReducer";

const reducer = combineReducers({
    notification: notificationsReducer,
    // ...other reducers
});

const store = createStore(reducer);

export default store;