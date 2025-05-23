import { useSelector, useDispatch } from "react-redux";
import { increaseVote } from "../reducers/anecdoteReducer";
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

  const vote = (anecdote) => {
    dispatch(increaseVote(anecdote));
    dispatch(setNotification(`you voted for '${anecdote.content}'`));
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
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdotesList;
