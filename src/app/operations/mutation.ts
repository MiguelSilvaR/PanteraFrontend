import gql from 'graphql-tag'

export const login = gql`
    mutation ($user:String!, $password:String!){
	    signIn(login:$user, password: $password){
            token
        }
    }
` 