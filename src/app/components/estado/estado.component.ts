import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarestadoComponent } from '../estado/listarestado/listarestado.component';

@Component({
  selector: 'app-estado',
  imports: [RouterOutlet, ListarestadoComponent],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css',
})
export class EstadoComponent {
  constructor(public route:ActivatedRoute) {}

}
