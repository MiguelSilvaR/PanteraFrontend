import { Component, OnInit, ElementRef } from '@angular/core';
import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { ApiService } from '../services/api.service';
import { isAfter, addMinutes, set } from "date-fns";
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
    private api: ApiService) { }

  ngOnInit() {
    let myReservationsSubs = this.api.getMyReservations().subscribe((reservations) => {
      reservations.forEach(res => {
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

        let ev: CalendarEvent[] = []
        ev.push(myRes)
        this.events = ev;
      });
      myReservationsSubs.unsubscribe()
    }, (err) => {
      console.log(err);
      myReservationsSubs.unsubscribe()
    });

    this.elementRef.nativeElement.ownerDocument.body.style.background = "white"
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
      dates:[
        {
          start: set(new Date, { hours: this.timeStart.hour, minutes: this.timeStart.minute }),
          end: set(new Date, { hours: this.timeEnd.hour, minutes: this.timeEnd.minute })
        }
      ]
    }
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
}
