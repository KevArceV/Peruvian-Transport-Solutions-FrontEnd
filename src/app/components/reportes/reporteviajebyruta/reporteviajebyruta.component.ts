import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { ViajeService } from '../../../services/Viaje.service';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-reporteviajebyruta',
  imports: [BaseChartDirective],
  templateUrl: './reporteviajebyruta.component.html',
  styleUrl: './reporteviajebyruta.component.css'
})
export class ReporteviajebyrutaComponent implements OnInit{
barChartOptions:ChartOptions={
  responsive:true,
  maintainAspectRatio: false,
}
barChartLabels:string[]=[]
barCharType:ChartType='doughnut'
barChartLegend=true
barChartData:ChartDataset[]=[]
constructor(private vS:ViajeService){}

ngOnInit(): void {
  this.vS.getQuantity().subscribe(data=>{
    this.barChartLabels=data.map(viaje=>viaje.location)
    this.barChartData=[
      {
        data:data.map(viaje=>viaje.quantityViaje),
        label:'Cantidad',
        backgroundColor:[
          '#ad80ad',
          '#abd3f5',
        ],
        borderColor:'#1062a8',
        borderWidth:1
      }
    ]
  })
}
}