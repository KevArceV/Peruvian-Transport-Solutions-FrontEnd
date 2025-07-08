import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarasientoComponent } from './listarasiento/listarasiento.component';

@Component({
  selector: 'app-asiento',
  imports: [RouterOutlet, ListarasientoComponent],
  templateUrl: './asiento.component.html',
  styleUrl: './asiento.component.css'
})
export class AsientoComponent {
  constructor(public route:ActivatedRoute){}
}
