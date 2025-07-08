import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ReporteviajebyrutaComponent } from './reporteviajebyruta/reporteviajebyruta.component';

@Component({
  selector: 'app-reportes',
  imports: [RouterOutlet, ReporteviajebyrutaComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  constructor(public route: ActivatedRoute) {}
}
