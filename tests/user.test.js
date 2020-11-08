import 'cross-fetch/polyfill' 
import ApolloBoost, { gql } from 'apollo-boost'
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import { extractFragmentReplacements } from 'prisma-binding'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
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
    expects(userExists).toBe(true)
})  

