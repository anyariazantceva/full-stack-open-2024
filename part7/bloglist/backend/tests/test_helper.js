const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

const blogWithoutLikes = {
    title: "Blog without likes",
    author: "Test test",
    url: "https://reactpatterns.com/",
}

const blogWithoutTitle = {
    author: "Test test",
    url: "https://reactpatterns.com/",
    likes: 3
}

const blogWithoutUrl = {
    author: "Test test",
    title: "Blog without url",
    likes: 3
}

const initialUsers = [
    {
        username: 'userA',
        name: 'userA',
        passwordHash: 'secret'
    },
    {
        username: 'userB',
        name: "userB",
        password: 'test'
    },
]

const uniqueUser = {
    username: "uniqueUser",
    name: 'UniqueUser',
    password: "unique"
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const notUniqueUser = {
    username: 'userA',
    name: 'userA',
    passwordHash: 'secret'
}

const userWithoutPassword = {
    username: 'userWithoutPassword',
    name: 'userWithoutPassword'
}

const userWithoutUsername = {
    name: 'userWithoutPassword',
    password: "test"
}

const userWithTwoCharsUsername = {
    username: 'us',
    name: 'userWithTwoCharsUsername',
    password: 'testpass'
}

const userWithTwoCharsPassword = {
    username: 'uswewe',
    name: 'userWithTwoCharsUsername',
    password: 'te'
}

const loginUser = {
    username: 'loginUser',
    password: 'secret'
}

const addLoginUser = async () => {
    const passwordHash = await bcrypt.hash(loginUser.password, 10)
    const user = new User({ username: loginUser.username, passwordHash })
    await user.save()
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb,
    blogWithoutLikes,
    blogWithoutTitle,
    blogWithoutUrl,
    initialUsers,
    uniqueUser,
    notUniqueUser,
    userWithoutPassword,
    userWithTwoCharsUsername,
    userWithoutUsername,
    userWithTwoCharsPassword,
    loginUser,
    addLoginUser
}