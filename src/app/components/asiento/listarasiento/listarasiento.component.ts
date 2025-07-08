import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Asiento } from '../../../models/Asiento';
import { AsientoService } from '../../../services/Asiento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listarasiento',
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
  templateUrl: './listarasiento.component.html',
  styleUrl: './listarasiento.component.css'
})
export class ListarasientoComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Asiento> = new MatTableDataSource();
  filtro: string = '';
  totalRegistros: number = 0;
  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private aS: AsientoService) {}

  ngOnInit(): void {
    this.aS.list().subscribe((data: Asiento[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (asiento: Asiento, filter: string) => {
        const f = filter.trim().toLowerCase();
        return asiento.seatNumberAsiento.toString().includes(f) ||
          asiento.bus?.idBus.toString().includes(f) ||
          asiento.estado?.statusTypeEstado.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.aS.getList().subscribe((data: Asiento[]) => {
      this.dataSource = new MatTableDataSource(data);
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
    this.aS.deleteI(id).subscribe(() => {
      this.aS.list().subscribe((data: Asiento[]) => {
        this.aS.setList(data);
        this.totalRegistros = data.length;
      });
    });
  }

  get asientosPaginados() {
    const start = this.paginaActual * this.pageSize;
    const end = start + this.pageSize;
    return this.dataSource.filteredData.slice(start, end);
  }

  cambiarPagina(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
