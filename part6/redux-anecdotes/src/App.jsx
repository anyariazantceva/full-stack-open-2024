import AnecdotesForm from "./components/AnecdotesForm";
import AnecdotesList from "./components/AnecdotesList";
import Notifications from "./components/Notifications";

const App = () => {
  return (
    <div>
      <Notifications />
      <AnecdotesList />
      <AnecdotesForm />
    </div>
  );
};

export default App;
