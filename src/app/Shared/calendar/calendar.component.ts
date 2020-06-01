import { Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { set, differenceInDays, addDays } from "date-fns"

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  ngOnInit() {
  }

  @Output() eventos = new EventEmitter<CalendarEvent[]>();

  CalendarView = CalendarView
  @Input() view: CalendarView;
  viewDate: Date = new Date();
  @Input() actions: CalendarEventAction[]
  refresh: Subject<any> = new Subject();
  _events: CalendarEvent[];

  @Input()
  set events(events: CalendarEvent[]) {
    this._events = events;
    this.refresh.next();
  }
  get events() { return this._events; }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    let hourStart = newStart.getHours()
    let houtEnd = newEnd.getHours()
    let minuteStart = newStart.getMinutes()
    let minuteEnd = newEnd.getMinutes()
    let diffDays = differenceInDays(newStart, event.start )
    this.events = this.events.map((iEvent) => {
      if (iEvent.meta.id === event.meta.id) {
        return {
          ...event,
          start: addDays(set(iEvent.start, {hours: hourStart, minutes: minuteStart}),diffDays),
          end: addDays(set(iEvent.end, {hours: houtEnd, minutes: minuteEnd}),diffDays),
        };
      }
      return iEvent;
    });
    this.eventos.emit(this.events);
    this.refresh.next()
  }

  setView(view: CalendarView) {
    this.view = view;
  }
}
