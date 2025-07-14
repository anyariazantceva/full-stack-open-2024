const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany([])
  await helper.addLoginUser()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the first blog is about React', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  expect(titles).toContain('React patterns')
})

test('verify that unique identifier is called id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('a valid blog can be added ', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = (await api.post('/api/login')).send(helper.loginUser)
    const newBlog = {
      title: "New blog title",
      author: "Test User",
      url: "http://www.newblog.com",
      likes: 3
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(newBlog)

    const blogsAtEnd = await helper.blogsInDb();

    expect(response.body.title).toEqual(newBlog.title)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutLikes)
    const newBlog = response.body
    const blogsAtEnd = await helper.blogsInDb()

    expect(newBlog.likes).toBe(0)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
  })

  test('should fail if the title property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutTitle).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('should fail if the url property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.post('/api/blogs/').set('Authorization', `Bearer ${loggedUser.body.token}`).send(helper.blogWithoutUrl).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const loggedUser = await api.post('/api/login').send(helper.loginUser)
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${loggedUser.body.token}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  })
})

describe('updating a blog', () => {
  test('should update blog successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeUpdated = { ...blogsAtStart[0] }
    blogToBeUpdated.likes++

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogToBeUpdated)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogToBeUpdated.id
    )
    expect(updatedBlog).toEqual(blogToBeUpdated)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
})