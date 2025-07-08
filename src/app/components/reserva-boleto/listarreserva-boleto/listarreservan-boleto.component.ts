import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Reserva_boleto } from '../../../models/Reserva_boleto';
import { ReservaBoletoService } from '../../../services/Reserva_boleto.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-listarreservan-boleto',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatMenuModule,
    RouterLink,
    MatPaginatorModule,

    ],  
  templateUrl: './listarreservan-boleto.component.html',
  styleUrl: './listarreservan-boleto.component.css'
})
export class ListarreservanBoletoComponent implements OnInit {
  dataSource: MatTableDataSource<Reserva_boleto> = new MatTableDataSource<Reserva_boleto>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  filtro = 'monto'; 
  entrada = '';       
  cache:   Reserva_boleto[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private rB: ReservaBoletoService, private snackBar: MatSnackBar) {}

  filtrosDisponibles = [
    { key: 'id', label: 'ID' },
    { key: 'monto', label: 'Monto mayor del Boleto' },
    { key: 'asientos', label: 'Cantidad de Asientos' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'pago', label: 'Pago' },
    { key: 'asiento', label: 'Asiento' },
  ];

  get filtroLabel(): string {
    return (
      this.filtrosDisponibles.find(f => f.key === this.filtro)?.label ??
      'Seleccionar'
    );
  }

  placeholder(): string {
    switch (this.filtro) {
      case 'id':        return 'Ingrese el ID';
      case 'monto':     return 'Monto mínimo';
      case 'asientos':  return 'Cantidad mínima de asientos';
      case 'usuario':   return 'Nombre de usuario';
      case 'pago':      return 'Tipo de Pago';
      case 'asiento':   return 'Numero de asiento';
      default:          return '';
    }
  }

  ngOnInit(): void {
    this.rB.list().subscribe((data:Reserva_boleto[]) => {
      this.dataSource = new MatTableDataSource<Reserva_boleto>(data);
      console.log('list() retorno', data.length);
      this.cache = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.rB.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.rB.deleteA(id).subscribe({
    next: () => {
      this.rB.list().subscribe((data) => {
          this.rB.setList(data);
      });
    },
    error: err => {
        // Muestra snackbar en rojo si hay error de integridad referencial
        this.snackBar.open(
          'No se puede eliminar: esta Reserva Boleto está enlazado con otra entidad.',
          'Cerrar',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      }
    });
  }

  buscar() {
    const term = this.entrada.trim();

    if (this.filtro === 'monto') {
      const value = +term;
      if (value > 0) {
        this.rB.listByAmount(value).subscribe(d => this.dataSource.data = d);
      } else {
        this.dataSource.data = this.cache;
      }
      return;
    }

  const resultado = this.cache.filter(r => {
    switch (this.filtro) {
      case 'id':
        return r.idReservaBoleto === +term;
      case 'asientos':
        return r.seatQuantityReservaBoleto === +term;
      case 'usuario':
        return r.usuario.username.toLowerCase().includes(term.toLowerCase());
      case 'pago':
        return r.pago.paymentTypePago.toLowerCase().includes(term.toLowerCase());
      case 'asiento':
        return r.asiento.seatNumberAsiento === +term;
      default:
        return false;
    }
  });

  this.dataSource.data = resultado;
  
}
  reset(): void {
    this.entrada = '';
    this.dataSource.data = this.cache;
}
}