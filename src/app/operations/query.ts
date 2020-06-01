import gql from 'graphql-tag'

export const myReservations = gql`
    query reservaciones{
        myReservations {
            start
            end
            room{
                id
                name
            }
            user {
                name
            }
        }
    }
` 

export const fastReservation = gql`
    query fastReservation ($filter:roomsFilter!) {
        bookableRooms(filter:$filter){
            name
            id
            building {
                name
            }
        }
    }
` 