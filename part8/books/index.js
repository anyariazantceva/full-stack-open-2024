const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
require('dotenv').config()


const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

// let authors = [
//     {
//         name: 'Robert Martin',
//         id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//         born: 1952,
//     },
//     {
//         name: 'Martin Fowler',
//         id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//         born: 1963
//     },
//     {
//         name: 'Fyodor Dostoevsky',
//         id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//         born: 1821
//     },
//     {
//         name: 'Joshua Kerievsky', // birthyear not known
//         id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//     },
//     {
//         name: 'Sandi Metz', // birthyear not known
//         id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//     },
// ]

// let books = [
//     {
//         title: 'Clean Code',
//         published: 2008,
//         author: 'Robert Martin',
//         id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Agile software development',
//         published: 2002,
//         author: 'Robert Martin',
//         id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//         genres: ['agile', 'patterns', 'design']
//     },
//     {
//         title: 'Refactoring, edition 2',
//         published: 2018,
//         author: 'Martin Fowler',
//         id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Refactoring to patterns',
//         published: 2008,
//         author: 'Joshua Kerievsky',
//         id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'patterns']
//     },
//     {
//         title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//         published: 2012,
//         author: 'Sandi Metz',
//         id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'design']
//     },
//     {
//         title: 'Crime and punishment',
//         published: 1866,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'crime']
//     },
//     {
//         title: 'Demons',
//         published: 1872,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'revolution']
//     },
// ]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
    type Book {
     title: String!
     published: Int
     author: Author!
     id: ID!
     genres: [String]
    }

    type Author {
      name: String!
      born: Int
      bookCount: Int!      
    }
    
    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]!
        ) : Book
        addAuthor(
            name: String!
            born: Int
        ) : Author
        editAuthor(
            name: String
            setBornTo: Int!
        ) : Author
    }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let query = {};

            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                if (author) query.author = author._id;
            }

            if (args.genre) {
                query.genres = args.genre;
            }

            return Book.find(query).populate('author');
        },
        allAuthors: async () => {
            const authors = await Author.find({});
            const books = await Book.find({});

            return authors.map(author => {
                const count = books.filter(b => b.author === author.name).length;
                return {
                    name: author.name,
                    born: author.born || null,
                    bookCount: count
                };
            });
        }

    },
    Mutation: {
        addAuthor: async (root, args) => {
            const author = new Author({ ...args })
            try {
                await author.save()
                return author
            } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }

        },
        addBook: async (root, args) => {
            // ensure author exists
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({ name: args.author, born: null });
                await author.save();
            }

            const book = new Book({
                title: args.title,
                published: args.published,
                genres: args.genres,
                author: author._id, // 👈 store ObjectId, not string
            });

            try {
                await book.save();
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error,
                    },
                });
            }
            return book.populate('author');
        },
        editAuthor: (root, args) => {
            // const author = authors.find(a => a.name === args.name)
            // if (!author) {
            //     return null
            // }

            // const updatedAuthor = { ...author, born: args.setBornTo }
            // authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
            // return updatedAuthor
        }
    },
    Author: {
        bookCount: async (root) => Book.countDocuments({ author: root._id }),
    },

}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})