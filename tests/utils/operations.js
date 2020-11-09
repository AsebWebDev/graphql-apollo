import { gql } from 'apollo-boost'
import { postOne } from './seedDatabase'


const createUser = gql`
    mutation ($data:CreateUserInput!) {
        createUser(
            data: $data
        ) {
            token, 
            user {
                id
                name
                email
            }
        }
    }
`

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`


const login = gql`
    mutation ($data:LoginUserInput!){
        login(
            data: $data
        ) {
            token
        }
    }
`

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`

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

const updatePost = gql`
    mutation ($id: ID!, $data: UpdatePostInput!) { 
        updatePost(
            id: $id
            data: $data
        ){
            id
            title
            body
            published
        }
    }    
`

const createPost = gql`
    mutation ($data: CreatePostInput!) { 
        createPost(
            data: $data
        ){
            id
            title
            body
            published
        }
    }    
`

const deletePost = gql`
    mutation ($id: ID!) { 
        deletePost(
            id: $id
        ){
            id
            title
            body
            published
        }
    }    
`

const deleteComment = gql`
    mutation ($id: ID!) { 
        deleteComment(
            id: $id
        ){
            id
            text
        }
    }    
`

export { createUser, login, getProfile, getUsers, getPosts, getMyPosts, updatePost, createPost, deletePost, deleteComment }