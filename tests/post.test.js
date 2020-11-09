import 'cross-fetch/polyfill' 
import { gql } from 'apollo-boost'
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
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

test('should be able to update own post', async () => {
    const client = getClient(userOne.jwt)

    const updatePost = gql`
        mutation { 
            updatePost(
                id: "${postOne.post.id}",
                data: {
                    published: false
                }
            ){
                id
                title
                body
                published
            }
        }    
    `

    const { data } = await client.mutate({ mutation: updatePost })
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })
    expect(data.updatePost.published).toBe(false)
    expect(exists).toBe(true)
})

test('should be able to create post', async () => {
    const client = getClient(userOne.jwt)

    const createPost = gql`
        mutation { 
            createPost(
                data: { 
                    title: "${postOne.input.title}",
                    body: "${postOne.input.body}",
                    published: ${postOne.input.published},
                }
            ){
                id
                title
                body
                published
            }
        }    
    `

    const { data } = await client.mutate({ mutation: createPost })
    const exists = await prisma.exists.Post({ id: postOne.post.id })
    expect(data.createPost.title).toBe(postOne.input.title)
    expect(data.createPost.body).toBe(postOne.input.body)
    expect(data.createPost.published).toBe(postOne.input.published)
    expect(exists).toBe(true)
})

test('should be able to delete post', async () => {
    const client = getClient(userOne.jwt)

    const deletePost = gql`
        mutation { 
            deletePost(
                id: "${postTwo.post.id}"
            ){
                id
                title
                body
                published
            }
        }    
    `
    await client.mutate({ mutation: deletePost })
    const exists = await prisma.exists.Post({ id: postTwo.post.id })
    expect(exists).toBe(false)
})