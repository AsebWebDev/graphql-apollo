import 'cross-fetch/polyfill' 
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, login, getProfile, getUsers } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('should create a new user', async () => {

    const variables = {
        data: {
            name: "Andrew",
            email: "andre@posteo.de",
            password: "red12345"
        }
    }

    const response = await client.mutate(({
        mutation: createUser,
        variables
    }))

    const userExists = await prisma.exists.User({ id: response.data.id })
    expect(userExists).toBe(true)
})  

test('Should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[1].email).toBe(null)
    expect(response.data.users[0].name).toBe('JenDummy')
    expect(response.data.users[1].name).toBe('PeterDummy')
})

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "jeff@example.com",
            password: "hiuhuhi"
        }
    }

    await expect((client.mutate({ mutation: login, variables }))).rejects.toThrow()
})

test('should not signup with short password', async () => {
    const variables = {
        data: {
            name: "Andrew",
            email: "andre@posteo.de",
            password: "red"
        }
    }

    await expect((client.mutate({ mutation: createUser, variables }))).rejects.toThrow()
})

test('should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    
    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})
