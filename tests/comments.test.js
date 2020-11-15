import 'cross-fetch/polyfill' 
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import seedDatabase, { userTwo, commentOne, commentTwo, postOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment, subscribeToComments, subscribeToPosts } from './utils/operations'
import { subscribe } from 'graphql'

const client = getClient()

beforeEach(seedDatabase)
beforeAll(() => {
    jest.setTimeout(10000);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('should delete own comment', async () => {
    const client = getClient(userTwo.jwt)
    const variables = { id: commentOne.comment.id }
    await client.mutate({ mutation: deleteComment, variables })
    const commentExists = await prisma.exists.Comment({ id: commentOne.comment.id })
    expect(commentExists).toBe(false)
})  

test('should not delete others users comments', async () => {
    const client = getClient(userTwo.jwt)
    const variables = { id: commentTwo.comment.id }
    await expect(client.mutate({ mutation: deleteComment, variables })).rejects.toThrow()
}) 

test('should subscribe to comments for a post', async (done) => {
    const variables = { postId: postOne.post.id } 

    client.subscribe({ query: subscribeToComments, variables })
    .subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe("DELETED")
            done()
        }
    })

    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
})

test('should subscribe to posts', async(done) => {
    const variables = { postId: postOne.post.id } 
    
    client.subscribe({ query: subscribeToPosts, variables })
    .subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe("DELETED")
            done()
        }
    })

    await prisma.mutation.deletePost({ where: { id: postOne.post.id }})
})