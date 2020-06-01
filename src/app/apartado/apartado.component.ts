import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-apartado',
  templateUrl: './apartado.component.html',
  styleUrls: ['./apartado.component.scss']
})
export class ApartadoComponent implements OnInit {

  constructor(private api:ApiService) { }

  ngOnInit() {
  }

}
