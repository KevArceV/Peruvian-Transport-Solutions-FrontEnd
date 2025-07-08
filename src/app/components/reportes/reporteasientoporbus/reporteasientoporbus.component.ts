import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AsientoService } from '../../../services/Asiento.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-reporteasientoporbus',
  imports: [BaseChartDirective],
  templateUrl: './reporteasientoporbus.component.html',
  styleUrl: './reporteasientoporbus.component.css'
})
export class ReporteasientoporbusComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true }
    }
  };

  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartData: ChartDataset[] = [];

  constructor(private asientoService: AsientoService){}

  ngOnInit(): void {
    this.asientoService.getQuantitySeatsPerBus().subscribe(data => {
      const sorted = data.sort((a, b) => b.cantidadAsientos - a.cantidadAsientos);

      this.barChartLabels = sorted.map(bus => `Bus ${bus.idBus}`);
      this.barChartData = [
        {
          data: sorted.map(bus => bus.cantidadAsientos),
          label: 'Asientos Vendidos',
          backgroundColor: ['#FFC107', '#C5A608', '#C39A52', '#A4953C', '#C09C30']
        }
      ]
    })
  }
}
