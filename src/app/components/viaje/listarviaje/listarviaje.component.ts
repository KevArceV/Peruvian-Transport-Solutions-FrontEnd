import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Viaje } from '../../../models/Viaje';
import { ViajeService } from '../../../services/Viaje.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarviaje',

  imports: [
    MatTableModule, 
    MatIconModule, 
    CommonModule, 
    RouterLink, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatPaginatorModule
  
  ],

  templateUrl: './listarviaje.component.html',
  styleUrl: './listarviaje.component.css'
})
export class ListarviajeComponent implements AfterViewInit {
   dataSource: MatTableDataSource<Viaje> = new MatTableDataSource<Viaje>();
   displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5','c6','c7', 'c8'];
   viajeFiltro: string = '';
   @ViewChild(MatPaginator) paginator!: MatPaginator; 

   constructor(private vS: ViajeService,    
     private snackBar: MatSnackBar   ) {}

   ngOnInit(): void {
    this.vS.list().subscribe((data:Viaje[]) => {
      this.dataSource = new MatTableDataSource<Viaje>(data);
      this.dataSource.filterPredicate = (data: Viaje, filter: string) => {
        const f =filter.trim().toLowerCase();
        return data.priceViaje.toString().includes(f)
          || data.departureDateViaje.toLowerCase().includes(f)
          || data.idViaje.toString().includes(f)
          || data.ruta.idRuta.toString().includes(f);  
      };
      this.dataSource.paginator = this.paginator;
    });
    this.vS.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  aplicarFiltro() {
    this.dataSource.filter = this.viajeFiltro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
 }
    eliminar(id: number) {
    this.vS.deleteI(id).subscribe({
      next: () => {
        // Refresca la tabla tras borrado exitoso
        this.vS.list().subscribe(list => {
          this.vS.setList(list);
        });
      },
      error: err => {
        // Muestra snackbar en rojo si hay error de integridad referencial
        this.snackBar.open(
          'No se puede eliminar: este viaje está enlazado con otra entidad.',
          'Cerrar',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      }
    });
  }
}

