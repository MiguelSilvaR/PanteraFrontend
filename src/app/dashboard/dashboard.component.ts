import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { isAfter, addMinutes, set } from "date-fns";
import Swal from "sweetalert2";

import { ApiService } from '../services/api.service';
import { colors } from '../Shared/const/colors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  timeValid: boolean = false;
  todayDate = new Date()
  todayPlusFifteenMin = addMinutes(this.todayDate, 15);
  errMessage = ""
  resultsFastRes = []
  dates = []

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event)
      },
    }
  ]

  events: CalendarEvent[] = []

  timeStart = { hour: this.todayDate.getHours(), minute: this.todayDate.getMinutes() };
  timeEnd = { hour: this.todayPlusFifteenMin.getHours(), minute: this.todayPlusFifteenMin.getMinutes() }

  constructor(
    private elementRef: ElementRef,
    private api: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.showLoading();
    this.getMyreservations()
    this.elementRef.nativeElement.ownerDocument.body.style.background = "white"
  }

  showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: "info",
      text: "Espere por favor, estamos cargando tu contenido"
    });
    Swal.showLoading();
  }

  getMyreservations() {
    let myReservationsSubs = this.api.getMyReservations().subscribe((reservations) => {
      this.buildEventsArray(reservations)
      myReservationsSubs.unsubscribe()
      Swal.close()
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
      Swal.close()
      this.alertErr();
    });
  }

  buildEventsArray(reservations) {
    let ev: CalendarEvent[] = []
    reservations.forEach(res => {
      let myRes = this.buildMyRes(res)
      ev.push(myRes)
    });
    this.events = ev;
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

  buildMyRes(res): CalendarEvent {
    let color;
    let title;
    if (isAfter(new Date(res.start), new Date())) {
      color = colors.blue;
      title = res.room.name + " - " + res.user.name;
    } else {
      color = colors.red;
      title = res.room.name + " - " + res.user.name + " (expirado)";
    }
    let myRes = {
      start: new Date(res.start),
      end: new Date(res.end),
      title,
      color,
      actions: this.actions
    }
    return myRes;
  }

  modelChanged() {
    this.errMessage = ""
    console.log(this.timeStart, this.timeEnd)

    if ((this.timeStart.hour >= 6 && this.timeStart.hour <= 23) && (this.timeEnd.hour >= 6 && this.timeEnd.hour <= 23)) {
      if (this.timeStart.hour > this.timeEnd.hour) {
        this.errMessage = "Tiempo de inicio mayor al final. "
        this.timeValid = true;
      } else if (this.timeStart.hour === this.timeEnd.hour && this.timeStart.minute >= this.timeEnd.minute) {
        this.errMessage = "Tiempo de inicio mayor o igual al final. "
        this.timeValid = true;
      } else if ((this.timeEnd.hour === 23 && this.timeEnd.minute !== 0)) {
        this.errMessage = this.errMessage + "La reserva no esta en el tiempo disponible"
        this.timeValid = true;
      } else if ((this.timeStart.hour === 6 && this.timeStart.minute < 30)) {
        this.errMessage = this.errMessage + "La reserva no esta en el tiempo disponible"
        this.timeValid = true;
      } else {
        this.timeValid = false;
      }
    } else {
      this.errMessage = "La reserva no esta en el tiempo disponible"
      this.timeValid = true;
    }
    if (!this.timeValid) {
      this.getPossibleReservations()
    }
  }

  getPossibleReservations() {
    let filter = {
      dates: [
        {
          start: set(new Date, { hours: this.timeStart.hour, minutes: this.timeStart.minute }),
          end: set(new Date, { hours: this.timeEnd.hour, minutes: this.timeEnd.minute })
        }
      ]
    }
    this.dates = filter.dates;
    let myReservationsSubs = this.api.getPossibleReservations(filter).subscribe((reservations) => {
      reservations.forEach(res => {
        this.resultsFastRes.push(res)
      });
      console.log(this.resultsFastRes)
      myReservationsSubs.unsubscribe()
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
    });
  }

  makeReservation(id, name) {
    let reservation = {
      dates: this.dates,
      roomId: id
    }
    console.log(reservation)
    this.confirmationReservation(reservation, name)
  }

  confirmationReservation(reservation, name) {
    Swal.fire({
      title: '¿Seguro de su reservación?',
      text: `Se reservará el salon ${name} en las horas previamente seleccionadas`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: "NO"
    }).then((result) => {
      if (result.value) {
        this.createReservation(reservation);
      }
    })
  }

  createReservation(reservation) {
    let createResSubs = this.api.createReservation(reservation).subscribe(({ data }:any) => {
      console.log(data)
      this.doneMessage();
      createResSubs.unsubscribe();
    },(error) => {
      console.log(error)
      createResSubs.unsubscribe();
    }); 
  }

  doneMessage() {
    Swal.fire({
      title: 'Listo',
      text: `Reservaste con éxito`,
      icon: 'success',
    }).then(() => {
      this.router.navigate(["dashboard"])
    })
  }
}
