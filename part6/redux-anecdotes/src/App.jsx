import AnecdotesForm from "./components/AnecdotesForm";
import AnecdotesList from "./components/AnecdotesList";

const App = () => {
  return (
    <div>
      <AnecdotesList />
      <AnecdotesForm />
    </div>
  );
};

export default App;
