import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Bus } from '../../../models/Bus';
import { BusService } from '../../../services/Bus.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-listarbus',
  imports: [
    RouterLink,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
  
  ],
  templateUrl: './listarbus.component.html',
  styleUrl: './listarbus.component.css'
})
export class ListarbusComponent implements OnInit{
  dataSource: MatTableDataSource<Bus> = new MatTableDataSource<Bus>();
  displayedColumns: string[]=["bus1","bus2","bus3","bus4","bus5","bus6"]
  BusFiltro: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private bS:BusService,     
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.bS.list().subscribe((data:Bus[]) => {
      this.dataSource = new MatTableDataSource<Bus>(data);
      this.dataSource.filterPredicate = (data: Bus, filter: string) => {
        const f =filter.trim().toLowerCase();
        return data.capacityBus.toString().includes(f)
          || data.durationBus.toLowerCase().includes(f)
          || data.viaje.idViaje.toString().includes(f)
      };
      this.dataSource.paginator = this.paginator;
      });
    this.bS.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
    }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltro() {
    this.dataSource.filter = this.BusFiltro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
 }


    eliminar(id: number) {
  this.bS.deleteI(id).subscribe({
    next: () => {
      // Vuelvo a pedir la lista completa
      this.bS.list().subscribe(data => {
        this.dataSource.data = data;
        this.snackBar.open('Bus eliminado correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      });
    },
    error: err => {
      this.snackBar.open(
        'No se puede eliminar, este bus está enlazado con otra entidad.',
        'Cerrar',
        { duration: 4000, panelClass: ['snack-error'] }
      );
    }
  });
}
}
