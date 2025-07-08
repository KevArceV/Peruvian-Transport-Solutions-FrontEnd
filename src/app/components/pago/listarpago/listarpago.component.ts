import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pago } from '../../../models/Pago';
import { PagoService } from '../../../services/Pago.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listarpago',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './listarpago.component.html',
  styleUrl: './listarpago.component.css'
})
export class ListarpagoComponent implements AfterViewInit {

  dataSource: MatTableDataSource<Pago> = new MatTableDataSource();
  filtro: string = '';
  totalRegistros: number = 0;

  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.pagoService.list().subscribe((data: Pago[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (pago: Pago, filter: string) => {
        const f = filter.trim().toLowerCase();
        return pago.idPago.toString().includes(f) ||
               pago.paymentTypePago.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.pagoService.getList().subscribe((data: Pago[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (pago: Pago, filter: string) => {
        const f = filter.trim().toLowerCase();
        return pago.idPago.toString().includes(f) ||
               pago.paymentTypePago.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltro() {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
    this.totalRegistros = this.dataSource.filteredData.length;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(id: number) {
    this.pagoService.deleteP(id).subscribe(() => {
      this.pagoService.list().subscribe((data: Pago[]) => {
        this.pagoService.setList(data);
        this.totalRegistros = data.length;
      });
    });
  }

  // para paginar tarjetas
  get pagosPaginados() {
    const start = this.paginaActual * this.pageSize;
    const end = start + this.pageSize;
    return this.dataSource.filteredData.slice(start, end);
  }

  cambiarPagina(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
