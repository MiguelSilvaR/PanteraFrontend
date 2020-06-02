import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { colors } from '../Shared/const/colors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-reservacion',
  templateUrl: './ver-reservacion.component.html',
  styleUrls: ['./ver-reservacion.component.scss']
})
export class VerReservacionComponent implements OnInit {

  actions: CalendarEventAction[] = []
  events: CalendarEvent[] = []

  idRes
  rommId
  res = {
    start: "",
    end: "",
    room: {
      name: "",
      building: {
        name: ""
      }
    }
  }

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getParams();
    this.getRoomInfo();
    this.getRoomReservations();
  }

  getParams() {
    this.idRes = this.route.snapshot.paramMap.get("id")
    this.rommId = this.route.snapshot.paramMap.get("roomId")
  }

  getRoomInfo() {
    let myReservationsSubs = this.api.getOneReservation(this.idRes).subscribe((reservation) => {
      this.res = reservation[0]
      this.buildMyReservation(reservation[0])
      myReservationsSubs.unsubscribe()
      //this.getRoomReservations();
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
    });
  }

  getRoomReservations() {
    console.log(this.rommId)
    let info = this.buildFilterRoom()
    let myReservationsSubs = this.api.getReservationsByRoomId(info).subscribe((reservations) => {

      this.buildEventsArray(reservations)
      myReservationsSubs.unsubscribe()

    }, (err) => {
      console.log(err);
    });
  }

  buildMyReservation(res) {
    let myRes = {
      start: new Date(res.start),
      end: new Date(res.end),
      title: res.room.name,
      color: colors.blue,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
      meta: {
        id: 0
      }
    }
    let ev = [...this.events]
    ev.push(myRes)
    this.events = ev
  }

  buildFilterRoom() {
    let info = {
      roomId: this.rommId
    }
    return info;
  }

  buildEventsArray(reservations) {
    let ev: CalendarEvent[] = [...this.events]
    reservations.forEach(res => {
      if (res.id != this.idRes) {
        let title = res.room.name + " - " + res.user.name + " (YA RESERVADO)";
        let myRes = this.buildMyRes(res, title, colors.red, -1)
        ev.push(myRes)
      }
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


  adjustEvents(event) {
    this.events = event;
    console.log(this.events)
  }

  update() {
    let myEvent;
    this.events.forEach((evento) => {
      if (evento.meta.id == 0) {
        myEvent = evento;
      }
    });
    let input = this.buildUpdate(myEvent);
    console.log(input)
    this.sendUpdate(input);
  }

  buildUpdate(ev:CalendarEvent) {
    let input = {
      id: this.idRes,
      start: ev.start.toISOString(),
      end: ev.end.toISOString(),
      roomId: this.rommId
    }
    return input;
  }

  sendUpdate(input) {
    let updateSubs = this.api.updateReservation(input).subscribe(({ data }:any) => {
      console.log(data)
      this.router.navigate(["/dashboard"])
      updateSubs.unsubscribe();
    },(err) => {
      console.log(err)
      updateSubs.unsubscribe();
    });
  }

  deleteReservation() {
    let input = {
      id: this.idRes
    }
    let deleteSubs = this.api.deleteReservation(input).subscribe(({data}) => {
      deleteSubs.unsubscribe()      
    },(err) => {
      console.log(err)
      this.showErr()

    })
  }

  showSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Hecho',
      text: 'Se ha eliminado tu reservación'
    }).then(() => {
      this.router.navigate(["dashboard"])
    })
  }

  showErr() {
    Swal.fire({
      icon: 'error',
      title: 'Opss....',
      text: 'Hubo un problema, inténtelo más tarde'
    }).then(() => {
      this.router.navigate(["dashboard"])
    })
  }

  showConfirmation() {
    Swal.fire({
      title: '¿Seguro de eliminar su reservación?',
      text: `Esta acción es irreversible`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: "NO"
    }).then((result) => {
      if (result) {
        this.showConfirmation()
      }
    })
  }

}
