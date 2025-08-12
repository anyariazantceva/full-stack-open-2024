import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      id
      author
      genres
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $authorName: String!
    $born: Int!
  ) {
    editAuthor(
      name: $authorName,
      setBornTo: $born
    ) {
      name
      born  
    }
  }
`