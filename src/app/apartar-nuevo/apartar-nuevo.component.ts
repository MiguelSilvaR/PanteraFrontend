import { Component, OnInit } from '@angular/core';

import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { addWeeks, addMinutes } from 'date-fns'
import Swal from "sweetalert2";

import { ApiService } from '../services/api.service';
import { colors } from '../Shared/const/colors';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartar-nuevo',
  templateUrl: './apartar-nuevo.component.html',
  styleUrls: ['./apartar-nuevo.component.scss']
})
export class ApartarNuevoComponent implements OnInit {

  actions: CalendarEventAction[] = []
  events: CalendarEvent[] = []

  myReservations = []
  reservationDates = []
  isRecurrent: boolean = false;
  numberOfWeeks: number = 1
  id: number = 0
  reservationForm:FormGroup 
  resultsFastRes = []

  constructor(
    private api: ApiService,
    private router:Router
  ) { }

  ngOnInit() {
    this.showLoading();
    this.getMyreservations();
    this.reservationForm = new FormGroup({ 
      "edificio": new FormControl("", Validators.required), 
      "cupo": new FormControl("", Validators.required) 
    })
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
      this.myReservations = reservations
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
      let title = res.room.name + " - " + res.user.name + " (YA RESERVADO)";
      let myRes = this.buildMyRes(res, title, colors.red, -1)
      ev.push(myRes)
    });
    this.events = ev;
  }

  buildMyRes(res, title, color, id): CalendarEvent {
    let myRes = {
      start: new Date(res.start),
      end: new Date(res.end),
      title,
      color,
      actions: this.actions,
      meta: {
        id
      }
    }
    return myRes;
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

  changeRecurrent(event) {
    this.numberOfWeeks = 1;
    this.isRecurrent = !this.isRecurrent;
    this.resetPossibleReservationValues()
  }

  setNumberOfWeeks(event) {
    this.numberOfWeeks = event.target.value;
    this.resetPossibleReservationValues()
  }

  setDate(event) {
    this.resetPossibleReservationValues()
    let reservationDate = new Date(event.year, event.month - 1, event.day)
    let ev = [...this.events];
    for (let index = 0; index < this.numberOfWeeks; index++) {
      let res = this.setStartAndEnd(reservationDate)
      let myRes = this.buildMyRes(res, "Posible reservación", colors.blue, this.id)
      myRes = this.buildPossibleRes(myRes)
      ev.push(myRes)
      reservationDate = addWeeks(reservationDate, 1);
    }
    this.id++
    this.events = ev;
    console.log(this.events)
  }

  setStartAndEnd(reservationDate: Date) {
    let res = {
      start: reservationDate,
      end: addMinutes(reservationDate, 30)
    }
    return res;
  }

  buildPossibleRes(myRes) {
    myRes.resizable = {
      beforeStart: true,
      afterEnd: true,
    };
    myRes.draggable = true;
    myRes.actions = [{
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event)
        this.events = this.events.filter((iEvent) => iEvent.meta.id !== event.meta.id);
      },
    },]
    return myRes
  }

  adjustEvents(event) {
    this.events = event;
    this.resetPossibleReservationValues()
  }

  resetPossibleReservationValues() {
    this.resultsFastRes = []
    this.reservationDates = []
  }

  reservar() {
    let miInfo = {
      building: this.reservationForm.controls["edificio"].value,
      capacity: this.reservationForm.controls["cupo"].value,
      dates: []
    } 
    miInfo = this.adjustPossibleReservation(miInfo)
    this.getPossibleReservations(miInfo)
  }

  adjustPossibleReservation(miInfo) {
    if (miInfo.building === "Cualquiera") {
      delete miInfo.building;
    }
    if (miInfo.capacity === "Cualquiera") {
      delete miInfo.capacity;
    }else {
      miInfo.capacity = Number.parseInt(miInfo.capacity)
    }
    this.events.forEach(event => {
      if (event.meta.id > -1) {
        let schedule = {
          start: event.start.toISOString(),
          end: event.end.toISOString()
        };
        miInfo.dates.push(schedule);
      }
      
    });
    return miInfo
  }

  getPossibleReservations(filter) {
    console.log(filter)
    let myReservationsSubs = this.api.getPossibleReservations(filter).subscribe((reservations) => {
      this.resultsFastRes = reservations;
      this.reservationDates = []
      this.reservationDates = filter.dates;
      myReservationsSubs.unsubscribe()
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
    });
  }

  makeReservation(id, name) {
    let reservation = {
      dates: this.reservationDates,
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
