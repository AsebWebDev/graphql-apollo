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

const postThree = {
    input: {
        title: "Test Title 3",
        body: "This is an published Test 3",
        published: false
    }, 
    post: null
}

const commentOne = {
    input: {
        text: "Comment 1 ",
    }, 
    comment: null
}

const commentTwo = {
    input: {
        text: "Comment 2 ",
    }, 
    comment: null
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Create UserOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = await jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create UserTwo
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.jwt = await jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // Create Post 1 - User One
    
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

    // Create Post 2 - User One
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

    // Create Post 3 - User Two

    postThree.post = await prisma.mutation.createPost({
        data: {
            ...postThree.input, 
            author: {
                connect: {
                    id: userTwo.user.id
                }
            }
        }
    })

    // Create Comment 1 one Post 3 by User Two

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input, 
            post: { 
                connect: {
                    id: postThree.post.id
                }
            },
            author: {
                connect: {
                    id: userTwo.user.id
                }
            }
        }
    })

    // Create Comment 2 one Post 1 by User One

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input, 
            post: { 
                connect: {
                    id: postOne.post.id
                }
            }, 
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, postThree, commentOne, commentTwo }