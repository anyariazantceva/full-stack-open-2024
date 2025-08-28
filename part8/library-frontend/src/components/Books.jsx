import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";
import { useState } from "react";

const Books = ({ show }) => {
  const [activeGenre, setActiveGenre] = useState(null);

  const userResult = useQuery(ME);
  const favouriteGenre = userResult.data?.me?.favouriteGenre ?? null;

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: activeGenre || favouriteGenre },
  });

  const allBooksResult = useQuery(ALL_BOOKS, { variables: { genre: null } });

  if (!show) return null;
  if (userResult.loading || booksResult.loading || allBooksResult.loading) {
    return <div>loading...</div>;
  }

  const books = booksResult.data.allBooks;
  const allGenres = [
    ...new Set(allBooksResult.data.allBooks.flatMap((book) => book.genres)),
  ];

  return (
    <div>
      <h2>books</h2>
      <div>
        {activeGenre === null && favouriteGenre
          ? `Showing books in your favourite genre: ${favouriteGenre}`
          : activeGenre && `Showing books in genre: ${activeGenre}`}
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            style={{
              fontWeight:
                genre === (activeGenre || favouriteGenre) ? "bold" : "normal",
            }}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setActiveGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
