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
            const author = await Author.findOne({ name: args.author });
            if (args.author && args.genre) {
                return Book.find({ $and: [{ author: author.id }, { genres: { $in: [args.genre] } }] }).populate("author");
            } else if (args.author) {
                return Book.find({ author: author.id }).populate("author");
            } else if (args.genre) {
                return Book.find({ genres: { $in: [args.genre] } }).populate("author");
            }
            return Book.find({}).populate("author");
        },
        allAuthors: async () => Author.find({}),

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
                        error: error.message
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
                        error: error.message
                    },
                });
            }
            return book.populate('author');
        },
        editAuthor: async (root, args) => {
            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo;
            try {
                await author.save()
            } catch (error) {
                throw new GraphQLError('Editing author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error: error.message
                    }
                })
            }
        }
    },
    Author: {
        bookCount: async (root) => Book.find({ author: root.id }).countDocuments(),
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