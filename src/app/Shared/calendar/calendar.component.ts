import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  ngOnInit() {
  }


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
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

  }

  setView(view: CalendarView) {
    this.view = view;
  }
}
