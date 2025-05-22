import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import anecdoteReducer, { setAnecdotes } from "./reducers/anecdoteReducer";
import filterReducer from "./reducers/filterReducer";
import notificationsReducer from "./reducers/notificationsReducer";
import anecdotesService from "./services/anecdotes";

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notifications: notificationsReducer,
  },
});

anecdotesService.getAll().then((anecdotes) =>
  anecdotes.forEach((anecdote) => {
    store.dispatch(setAnecdotes(anecdote));
  })
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
