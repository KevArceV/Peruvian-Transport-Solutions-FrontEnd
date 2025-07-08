import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarpagoComponent } from '../pago/listarpago/listarpago.component';

@Component({
  selector: 'app-pago',
  imports: [RouterOutlet, ListarpagoComponent],
  templateUrl: './Pago.component.html',
  styleUrl: './Pago.component.css',
})
export class PagoComponent {
  constructor(public route:ActivatedRoute) {}

}

