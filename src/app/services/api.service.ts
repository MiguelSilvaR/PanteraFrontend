import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { myReservations, fastReservation, getOneReservation, getAllReservationsOfARoom } from '../operations/query';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { psv, crearReservacion, updateReservation, deleteReservation } from '../operations/mutation';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private apollo:Apollo
  ) { }

  getMyReservations() {
    let token = localStorage.getItem("token")
    return this.apollo.watchQuery({
      query: myReservations,
      fetchPolicy: "network-only",
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data.myReservations;
      })
    )
  }

  getPossibleReservations(filter) {
    let token = localStorage.getItem("token")
    return this.apollo.watchQuery({
      query: fastReservation,
      variables: {
        filter
      },
      fetchPolicy: "network-only",
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data.bookableRooms;
      })
    )
  }

  getOneReservation(id) {
    let token = localStorage.getItem("token")
    return this.apollo.watchQuery({
      query: getOneReservation,
      variables: {
        id
      },
      fetchPolicy: "network-only",
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data.reservation;
      })
    )
  }

  getReservationsByRoomId(filter) {
    let token = localStorage.getItem("token")
    return this.apollo.watchQuery({
      query: getAllReservationsOfARoom,
      variables: {
        filter
      },
      fetchPolicy: "network-only",
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data.reservations;
      })
    )
  }

  postPSV(information) {
    let token = localStorage.getItem("token")
    return this.apollo.mutate({
      mutation: psv,
      variables: {
        information
      },
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    });
  }

  createReservation(reservation) {
    let token = localStorage.getItem("token")
    return this.apollo.mutate({
      mutation: crearReservacion,
      variables: {
        reservation
      },
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    });
  }

  updateReservation(input) {
    let token = localStorage.getItem("token")
    return this.apollo.mutate({
      mutation: updateReservation,
      variables: {
        input
      },
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    });
  }

  deleteReservation(input) {
    let token = localStorage.getItem("token")
    return this.apollo.mutate({
      mutation: deleteReservation,
      variables: {
        input
      },
      context: {
        headers: new HttpHeaders().set('x-token',token)
      }
    });
  }
  
}
