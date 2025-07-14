const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

mongoose.set('bufferTimeoutMS', 300000)
jest.setTimeout(300000)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('create user', () => {

    test('creation succeeds with unique user', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(helper.uniqueUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    })

    test('should fail if the username is not unique', async () => {
        await api.post('/api/users/')
            .send(helper.notUniqueUser)
            .expect(400)
    })

    test('should fail if the username is missing', async () => {
        await api.post('/api/users')
            .send(helper.userWithouUsername)
            .expect(400)
    })

    test('should fail if the username is less than 3 characters', async () => {
        await api.post('/api/users')
            .send(helper.userWithTwoCharsUsername)
            .expect(400)
    })

    test('should fail if the password is missing', async () => {
        await api.post('/api/users')
            .send(helper.userWithoutPassword)
            .expect(400)
    })

    test('should fail if the password is less than 3 characters', async () => {
        await api.post('/api/users')
            .send(helper.userWithTwoCharsPassword)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})