const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/', async (request, response) => {
    const comments = await Comment.find({}).populate('blog')
    response.json(comments)
})

commentsRouter.post('/:blogId', async (request, response) => {
    const { content } = request.body
    const blogId = request.params.blogId

    const blog = await Blog.findById(blogId)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    const comment = new Comment({ content, blog: blogId })
    const savedComment = await comment.save()

    response.status(201).json(savedComment)
})

module.exports = commentsRouter  