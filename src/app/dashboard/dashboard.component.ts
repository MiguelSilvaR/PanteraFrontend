import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private elementRef: ElementRef) 
    { }

  ngOnInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background = "white"
  }

}
