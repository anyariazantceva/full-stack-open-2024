const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
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
    
    type User {
        username: String!
        id: ID!
    }
    
    type Token {
        value: String!
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
         createUser(
            username: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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
        me: (root, args, context) => {
            return context.currentUser
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
                        error: error.message
                    }
                })
            }

        },
        addBook: async (root, args, context) => {
            let author = await Author.findOne({ name: args.author });
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            if (!author) {
                author = new Author({ name: args.author, born: null });
                await author.save();
            }

            const book = new Book({
                title: args.title,
                published: args.published,
                genres: args.genres,
                author: author._id,
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
        editAuthor: async (root, args, context) => {
            const author = await Author.findOne({ name: args.name })
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
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
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
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
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), process.env.JWT_SECRET
            )
            const currentUser = await User
                .findById(decodedToken.id)
            return { currentUser }
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})