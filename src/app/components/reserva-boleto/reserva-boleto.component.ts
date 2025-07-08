import { Component } from '@angular/core';
import { ListarreservanBoletoComponent } from "./listarreserva-boleto/listarreservan-boleto.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reserva-boleto',
  imports: [RouterOutlet, ListarreservanBoletoComponent],
  templateUrl: './reserva-boleto.component.html',
  styleUrl: './reserva-boleto.component.css'
})
export class ReservaBoletoComponent {
constructor(public route:ActivatedRoute) {}

}

