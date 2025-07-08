import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarviajeComponent } from './listarviaje/listarviaje.component';

@Component({
  selector: 'app-viaje',
  imports: [RouterOutlet, ListarviajeComponent],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css'
})
export class ViajeComponent {
  constructor(public route:ActivatedRoute){}

}
