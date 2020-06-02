import gql from 'graphql-tag'

export const myReservations = gql`
    query reservaciones{
        myReservations {
            id
            start
            end
            room{
                id
                name
            }
            user {
                id
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
                id
                name
            }
        }
    }
` 
export const getOneReservation = gql`
    query getOneReservation($id:ID!) {
        reservation(id:$id){
            id
            start
            end
            room {
                id
                name
                building {
                    id
                    name
                }
            }
        }
    }
`

export const getAllReservationsOfARoom = gql`
    query getAllReservationsOfARoom($filter:reservationsFilter!){
        reservations(filter:$filter){
            id
            start
            end
            user {
                id
                name
            }
            room {
                id
                name
            }
        }
    }
`