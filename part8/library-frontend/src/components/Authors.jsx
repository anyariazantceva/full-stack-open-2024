import { gql, useQuery, useMutation } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useState } from "react";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);
  const [authorName, setAuthorName] = useState("");
  const [born, setBorn] = useState("");
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      props.setError(messages);
    },
  });
  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();

    console.log("update author...");

    editAuthor({ variables: { authorName, born: Number(born) } });

    setAuthorName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
