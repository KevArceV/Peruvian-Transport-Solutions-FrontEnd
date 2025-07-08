import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PagoService } from '../../../services/Pago.service';

@Component({
  selector: 'app-reportepaymentsbytype',
  imports: [BaseChartDirective],
  templateUrl: './reportepaymentsbytype.component.html',
  styleUrl: './reportepaymentsbytype.component.css'
})
export class ReportepaymentsbytypeComponent {
  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  pieChartLabels: string[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartData: number[] = [];

  constructor(private pagoService: PagoService){}

  ngOnInit(): void {
    this.pagoService.getPaymentsByType().subscribe(data => {
      const tiposDePago = data.map(item => item.tipoPago);
      const cantidades = data.map(item => item.total);

      this.pieChartLabels = tiposDePago;
      this.pieChartData = cantidades;
    })
  }
}
