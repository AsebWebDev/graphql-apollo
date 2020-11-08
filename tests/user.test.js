import 'cross-fetch/polyfill' 
import ApolloBoost, { gql } from 'apollo-boost'
import bcrypt from 'bcryptjs'
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import { extractFragmentReplacements } from 'prisma-binding'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

beforeEach(async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const createdUser = await prisma.mutation.createUser({
        data: {
            name: 'JenDummy',
            email: 'jen@example.de',
            password: bcrypt.hashSync('red098!@#')
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: "Test Title 1",
            body: "This is a published Test 1",
            published: true,
            author: {
                connect: {
                    id: createdUser.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: "Test Title 2",
            body: "This is an unpublished Test 2",
            published: false,
            author: {
                connect: {
                    id: createdUser.id
                }
            }
        }
    })
})

test('should create a new user', async () => {
    const createUser = gql`
    mutation {
        createUser(
            data: {
                name: "Andrew",
                email: "andre@posteo.de",
                password: "red12345"
            }
        ) {
            token, 
            user {
                id
            }
        }
    }`

    const response = await client.mutate(({
        mutation: createUser
    }))

    const userExists = await prisma.exists.User({ id: response.data.id })
    expect(userExists).toBe(true)
})  

test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `

    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('JenDummy')
})

test('Should expose only one published post', async () => {
    const getPosts = gql`
        query {
            posts {
                title
                body
                published
                author { 
                    id
                    name
                }
            }
        }
    `

    const response = await client.query({ query: getPosts })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
    expect(response.data.posts[0].title).toBe("Test Title 1")
})

test('Should not logn with bad credentials', async () => {
    const login = gql`
        mutation {
            login(
                data: {
                    email: "jeff@example.com",
                    password: "hiuhuhi"
                }
            ) {
                token
            }
        }
    `

    await expect((client.mutate({ mutation: login }))).rejects.toThrow()
})

test('should not signup with short password', async () => {
    const createUser = gql`
    mutation {
        createUser(
            data: {
                name: "Andrew",
                email: "andre@posteo.de",
                password: "red"
            }
        ) {
            token, 
            user {
                id
            }
        }
    }`

    await expect((client.mutate({ mutation: createUser }))).rejects.toThrow()
})
