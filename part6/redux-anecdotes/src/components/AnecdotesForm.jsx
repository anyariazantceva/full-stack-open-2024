import { createAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch } from "react-redux";
import anecdotesService from "../services/anecdotes";

const AnecdotesForm = () => {
  const dispatch = useDispatch();
  const create = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    const newAnecdote = await anecdotesService.createNew(content);
    dispatch(createAnecdote(newAnecdote));
  };
  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={create}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdotesForm;
