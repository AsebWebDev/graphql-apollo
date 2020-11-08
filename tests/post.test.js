import 'cross-fetch/polyfill' 
import { gql } from 'apollo-boost'
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

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

test('Should expose authenticated and unpublished posts of UserOne', async () => {
    const client = getClient(userOne.jwt)

    const getMyPosts = gql`
        query {
            myPosts {
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

    const response = await client.query({ query: getMyPosts })

    expect(response.data.myPosts.length).toBe(2)
})