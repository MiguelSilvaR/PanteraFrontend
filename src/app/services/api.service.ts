import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { myReservations, fastReservation } from '../operations/query';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { psv } from '../operations/mutation';

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

  postPSV(information) {
    return this.apollo.mutate({
      mutation: psv,
      variables: {
        information
      }
    });
  }
}
