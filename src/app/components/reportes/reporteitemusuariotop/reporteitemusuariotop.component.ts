// reporteitemusuariotop.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import Chart from 'chart.js/auto';
import { Item_usuarioService } from '../../../services/Item_usuario.service';

@Component({
  selector: 'app-reporteitemusuariotop',
  templateUrl: './reporteitemusuariotop.component.html',
  styleUrls: ['./reporteitemusuariotop.component.css']
})
export class ReporteitemusuariotopComponent implements OnInit, OnDestroy {
  @ViewChild('pieCanvas', { static: true })
  pieCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  constructor(private itemusuarioS: Item_usuarioService) {}

  ngOnInit(): void {
    this.itemusuarioS.getTOP().subscribe(data => {
      // 1) Asegúrate de tener un array
      const safeData = Array.isArray(data) ? data : [];

      // 2) Ordena y toma TOP 5
      const top5 = safeData
        .slice() // clon para no mutar
        .sort((a, b) =>
          (b.qualification_viaj ?? 0) - (a.qualification_viaj ?? 0)
        )
        .slice(0, 5);

      // 3) Prepara labels y valores, usando String() para evitar .toString() en undefined
      const labels = top5.map(item =>
        item.idItemUsuario != null ? String(item.idItemUsuario) : ''
      );
      const values = top5.map(item => item.qualification_viaj ?? 0);

      // 4) (Re)construye el chart
      this.renderChart(labels, values);
    });
  }

  private renderChart(labels: string[], data: number[]): void {
    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener contexto 2D');
      return;
    }

    // Si ya existe, destrúyelo antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            // Aquí puedes ajustar los colores si quieres
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
