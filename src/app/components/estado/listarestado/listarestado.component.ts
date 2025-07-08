import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Estado } from '../../../models/Estado';
import { EstadoService } from '../../../services/Estado.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarestado',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './listarestado.component.html',
  styleUrl: './listarestado.component.css'
})
export class ListarestadoComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Estado> = new MatTableDataSource<Estado>();
  filtro: string = '';
  totalRegistros = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.estadoService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.totalRegistros = data.length;
      this.dataSource.filterPredicate = (estado, filter) =>
        estado.statusTypeEstado.toLowerCase().includes(filter.trim().toLowerCase());
    });
    this.estadoService.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  aplicarFiltro() {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
    this.totalRegistros = this.dataSource.filteredData.length;
    if (this.paginator) this.paginator.firstPage();
  }

  eliminar(id: number) {
    this.estadoService.deleteP(id).subscribe(() => {
      this.estadoService.list().subscribe(data => {
        this.dataSource.data = data;
        this.totalRegistros = data.length;
        this.aplicarFiltro();
      });
    });
  }
}
