import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-apartado',
  templateUrl: './apartado.component.html',
  styleUrls: ['./apartado.component.scss']
})
export class ApartadoComponent implements OnInit {

  constructor(private api:ApiService) { }

  myReservations = []

  ngOnInit() {
    this.getMyreservations()
  }

  getMyreservations() {
    let myReservationsSubs = this.api.getMyReservations().subscribe((reservations) => {
      this.myReservations = reservations;
      myReservationsSubs.unsubscribe()
      Swal.close()
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
      Swal.close()
      this.alertErr();
    });
  }

  alertErr() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salió mal, contacte al administrador'
    }).then(() => {
      //logout
    })
  }

}
