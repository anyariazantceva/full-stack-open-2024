const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

router.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await mongoose.connection.db.collection('users').dropIndexes()
    await mongoose.connection.db.collection('blogs').dropIndexes()

    console.log("Success reset")
    response.status(204).end()
})

module.exports = router