import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { RolService } from '../../../services/Rol.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reporteuserbyrol',
  imports: [BaseChartDirective],
  templateUrl: './reporteuserbyrol.component.html',
  styleUrl: './reporteuserbyrol.component.css'
})
export class ReporteuserbyrolComponent implements OnInit{
  barChartOptions:ChartOptions={
    responsive:true,
    maintainAspectRatio: false,
  }
  barChartLabels:string[]=[]
  barCharType:ChartType='doughnut'
  barChartLegend=true
  barChartData:ChartDataset[]=[]
  constructor(private rS:RolService){}

  ngOnInit(): void {
  this.rS.getQuantity().subscribe(data=>{
    this.barChartLabels=data.map(rol=>rol.rol)
    this.barChartData=[
      {
        data:data.map(rol=>rol.total_usuarios),
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
