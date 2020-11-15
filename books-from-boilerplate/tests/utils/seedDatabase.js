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

const seedDatabase = async () => {
    // Delete test data
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
}

export { seedDatabase as default, userOne, userTwo  }