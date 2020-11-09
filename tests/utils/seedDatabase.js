import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma.js'

const userOne = {
    input: {
        name: 'JenDummy',
        email: 'jen@example.de',
        password: bcrypt.hashSync('red098!@#')
    },
    user: null,
    jwt: null
}

const userTwo = {
    input: {
        name: 'PeterDummy',
        email: 'peter@example.de',
        password: bcrypt.hashSync('red099!@#')
    },
    user: null,
    jwt: null
}

const postOne = {
    input: {
        title: "Test Title 1",
        body: "This is a published Test 1",
        published: true,
    }, 
    post: null
}

const postTwo = {
    input: {
        title: "Test Title 2",
        body: "This is an unpublished Test 2",
        published: false
    }, 
    post: null
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Create UserOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = await jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create Post 1
    
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input, 
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // Create Post 2
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input, 
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, postOne, postTwo, userTwo}