import 'cross-fetch/polyfill' 
import 'core-js'
import 'regenerator-runtime/runtime'
import prisma from '../src/prisma.js'
import seedDatabase, { userTwo, commentOne, commentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

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