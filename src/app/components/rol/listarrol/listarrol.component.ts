import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Roles } from '../../../models/Role';
import { RolService } from '../../../services/Rol.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-listarrol',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule, 
    RouterModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './listarrol.component.html',
  styleUrl: './listarrol.component.css'
})
export class ListarrolComponent implements AfterViewInit {

  roles: Roles[] = [];
  rolesFiltrados: Roles[] = [];
  filtro: string = '';

  totalRegistros: number = 0;
  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private rolService: RolService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rolService.list().subscribe((data: Roles[]) => {
      this.roles = data;
      this.rolesFiltrados = data;
      this.totalRegistros = data.length;
    });

    this.rolService.getList().subscribe((data: Roles[]) => {
      this.roles = data;
      this.rolesFiltrados = data;
      this.totalRegistros = data.length;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginator.page.subscribe(event => this.cambiarPagina(event));
    });
  }

  aplicarFiltro() {
    const f = this.filtro.trim().toLowerCase();
    this.rolesFiltrados = this.roles.filter(r =>
      r.id?.toString().includes(f) ||
      r.rol.toLowerCase().includes(f) 

    );
    this.totalRegistros = this.rolesFiltrados.length;
    this.paginaActual = 0;
    if (this.paginator) this.paginator.firstPage();
  }

  get rolesPaginados() {
    const start = this.paginaActual * this.pageSize;
    const end = start + this.pageSize;
    return this.rolesFiltrados.slice(start, end);
  }

  cambiarPagina(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  eliminar(id: number) {
    this.rolService.deleteI(id).subscribe({
      next: () => {
        this.rolService.list().subscribe(list => {
          this.rolService.setList(list);
          this.roles = list;
          this.aplicarFiltro(); // vuelve a filtrar tras eliminación
          this.snackBar.open('Rol eliminado correctamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        });
      },
      error: () => {
        this.snackBar.open(
          'No se puede eliminar: este rol está enlazado con otra entidad.',
          'Cerrar',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      }
    });
  }
}
