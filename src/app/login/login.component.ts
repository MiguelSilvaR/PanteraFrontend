import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundRepeat = "no-repeat" 
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundSize = "cover" 
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = 
    "url(assets/img/bg-img.jpg),linear-gradient(to bottom, rgba(112,97,97, 0.1) 40%,rgba(112,97,97, 0.1) 40%)";
  }

}
