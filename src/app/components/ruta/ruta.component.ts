import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarrutaComponent } from './listarruta/listarruta.component';

@Component({
  selector: 'app-ruta',
  imports: [RouterOutlet,ListarrutaComponent],
  templateUrl: './ruta.component.html',
  styleUrl: './ruta.component.css'
})
export class RutaComponent {
constructor(public route:ActivatedRoute) {}
}
