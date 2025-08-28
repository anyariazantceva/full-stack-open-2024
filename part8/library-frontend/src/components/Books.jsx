import { gql, useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useMemo } from "react";
import { useState } from "react";

const Books = (props) => {
  const result = useQuery(ALL_BOOKS);
  const [activeGenre, setActiveGenre] = useState(null);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const allGenres = [
    ...new Set(result.data.allBooks.flatMap((book) => book.genres)),
  ];

  const booksToShow = activeGenre
    ? result.data.allBooks.filter((b) => b.genres.includes(activeGenre))
    : result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <p>in genre {activeGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
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
          <button key={genre} onClick={() => setActiveGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setActiveGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
