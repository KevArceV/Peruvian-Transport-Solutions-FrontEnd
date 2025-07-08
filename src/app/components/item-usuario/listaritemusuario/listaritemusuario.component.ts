import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item_usuario } from '../../../models/Item_usuario';
import { Item_usuarioService } from '../../../services/Item_usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-listaritemusuario',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './listaritemusuario.component.html',
  styleUrl: './listaritemusuario.component.css'
})
export class ListaritemusuarioComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Item_usuario> = new MatTableDataSource();
  filtro: string = '';
  totalRegistros: number = 0;

  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private ius: Item_usuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ius.list().subscribe((data: Item_usuario[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (itemusuario, filter) => {
        const f = filter.trim().toLowerCase();
        return itemusuario.idItemUsuario.toString().includes(f)
          || itemusuario.travelQualificationItemUsuario.toString().includes(f)
          || itemusuario.travelDateItemUsuario.toLowerCase().includes(f)
          || itemusuario.item?.titleItem.toString().includes(f)
          || itemusuario.usuario?.username.toString().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.ius.getList().subscribe((data: Item_usuario[]) => {
      this.dataSource.data = data;
      this.totalRegistros = data.length;
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(id: number) {
    this.ius.deleteI(id).subscribe({
      next: () => {
        this.ius.list().subscribe((data: Item_usuario[]) => {
          this.ius.setList(data);
          this.snackBar.open('Item Usuario eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        });
      },
      error: () => {
        this.snackBar.open('No se puede eliminar porque está enlazado a otra entidad', 'Cerrar', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
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
