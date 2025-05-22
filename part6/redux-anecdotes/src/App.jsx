import AnecdotesForm from "./components/AnecdotesForm";
import AnecdotesList from "./components/AnecdotesList";
import Notifications from "./components/Notifications";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import anecdotesService from "./services/anecdotes";
import { setAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    anecdotesService
      .getAll()
      .then((anecdotes) => dispatch(setAnecdotes(anecdotes)));
  }, []);
  return (
    <div>
      <Notifications />
      <AnecdotesList />
      <AnecdotesForm />
    </div>
  );
};

export default App;
