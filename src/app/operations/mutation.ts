import gql from 'graphql-tag'

export const login = gql`
    mutation ($user:String!, $password:String!){
	    signIn(login:$user, password: $password){
            token
        }
    }
` 

export const psv = gql`
    mutation psv ($information:createCSVInput!) {
        createCSV(input:$information){
            id
        }
    }
`   
export const crearReservacion = gql`
    mutation crearReservacion ($reservation:createReservationInput!) {
    createReservation(input:$reservation) {
            createdAt
            user {
                name
            }
            id
        }
    }
`   
export const updateReservation = gql`
    mutation updateReservation($input:updateReservationInput!){
        updateReservation(input:$input)
    }
`

export const deleteReservation = gql`
    mutation deleteReservation($input:deleteReservationInput!) {
        deleteReservation(input:$input)
    }
`