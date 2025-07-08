import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Ruta } from '../../../models/Ruta';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RutaService } from '../../../services/Ruta.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listarruta',
  imports: [FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule],
  templateUrl: './listarruta.component.html',
  styleUrl: './listarruta.component.css'
})
export class ListarrutaComponent implements AfterViewInit{
  dataSource: MatTableDataSource<Ruta> = new MatTableDataSource();
  filtro: string = '';
  totalRegistros: number = 0;

  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private rutaService: RutaService) {}

  ngOnInit(): void {
    this.rutaService.list().subscribe((data: Ruta[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (ruta: Ruta, filter: string) => {
        const f = filter.trim().toLowerCase();
        return ruta.idRuta.toString().includes(f) ||
               ruta.lat.toString().includes(f) ||
               ruta.lng.toString().includes(f) ||
               ruta.item.idItem.toString().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.rutaService.getList().subscribe((data: Ruta[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (ruta: Ruta, filter: string) => {
        const f = filter.trim().toLowerCase();
       return ruta.idRuta.toString().includes(f) ||
               ruta.lat.toString().includes(f) ||
               ruta.lng.toString().includes(f) ||
               ruta.item.idItem.toString().includes(f);
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
    this.rutaService.deleteI(id).subscribe(() => {
      this.rutaService.list().subscribe((data: Ruta[]) => {
        this.rutaService.setList(data);
        this.totalRegistros = data.length;
      });
    });
  }

  get itemsPaginados() {
    const start = this.paginaActual * this.pageSize;
    const end = start + this.pageSize;
    return this.dataSource.filteredData.slice(start, end);
  }

  cambiarPagina(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  
}
