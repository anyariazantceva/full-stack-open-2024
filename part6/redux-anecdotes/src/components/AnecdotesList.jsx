import { useSelector, useDispatch } from "react-redux";
import {
  voteForAnecdote,
  initializeAnecdotes,
} from "../reducers/anecdoteReducer";
import Filter from "../components/Filter";
import { setNotification } from "../reducers/notificationsReducer";

const AnecdotesList = () => {
  const anecdotes = useSelector((state) => {
    if (state.filter === "") {
      return state.anecdotes;
    } else {
      return state.anecdotes.filter((anecdote) => {
        return anecdote.content
          .toLowerCase()
          .includes(state.filter.toLowerCase());
      });
    }
  });

  const dispatch = useDispatch();
  dispatch(initializeAnecdotes());

  const vote = (id, content) => {
    dispatch(voteForAnecdote({ id }));
    dispatch(setNotification(`you voted for '${content}'`));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id, anecdote.content)}>
                vote
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdotesList;
