import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/Usuarios';
import { UsuarioService } from '../../../services/Usuario.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-listarusuario',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './listarusuario.component.html',
  styleUrls: ['./listarusuario.component.css']
})
export class ListarusuarioComponent implements OnInit {

  usDataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();
  usFiltro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private uS: UsuarioService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data: Usuario[]) => {
      this.usDataSource = new MatTableDataSource<Usuario>(data);
      this.usDataSource.filterPredicate = (data: Usuario, filter: string) => {
        const f = filter.trim().toLowerCase();
        return data.username.toLowerCase().includes(f);
      };
    });

    this.uS.getList().subscribe((data: Usuario[]) => {
      this.usDataSource = new MatTableDataSource<Usuario>(data);
      this.usDataSource.filterPredicate = (data: Usuario, filter: string) => {
        const f = filter.trim().toLowerCase();
        return data.username.toLowerCase().includes(f);
      };
    });
  }

  ngAfterViewInit() {
     setTimeout(() => {
    this.usDataSource.paginator = this.paginator;
    });
  }

  usAplicarFiltro() {
    this.usDataSource.filter = this.usFiltro.trim().toLowerCase();
    
  }

  eliminar(id: number) {
    this.uS.deleteA(id).subscribe({
      next: () => {
        // Refresca la tabla tras borrado exitoso
        this.uS.list().subscribe(list => {
          this.uS.setList(list);
        });
      },
      error: err => {
        // Muestra snackbar en rojo si hay error de integridad referencial
        this.snackBar.open(
          'No se puede eliminar: este usuario está enlazado con otra entidad.',
          'Cerrar',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      }
    });
  }

   showPasswordWarning() {
    this.snackBar.open(
      'Mostrar la contraseña va en contra la política de Peruvian Transport Solutions, en caso sea administrador, recuerde ingresar la acción en el registro de auditoría primero',
      'Cerrar',
      {
        duration: 4000, panelClass: ['snack-error'] 
      }
    );
  }
}
