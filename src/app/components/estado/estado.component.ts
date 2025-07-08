import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarestadoComponent } from '../estado/listarestado/listarestado.component';

@Component({
  selector: 'app-estado',
  imports: [RouterOutlet, ListarestadoComponent],
  templateUrl: './Estado.component.html',
  styleUrl: './Estado.component.css',
})
export class EstadoComponent {
  constructor(public route:ActivatedRoute) {}

}
