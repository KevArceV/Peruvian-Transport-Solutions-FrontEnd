import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Resenia } from '../../../models/Resenia';
import { ReseniaService } from '../../../services/Resenia.service';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarresenia',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './listarresenia.component.html',
  styleUrl: './listarresenia.component.css'
})
export class ListarreseniaComponent implements AfterViewInit {

  resDataSource: MatTableDataSource<Resenia> = new MatTableDataSource<Resenia>();
  resFiltro: string = '';
  totalRegistros: number = 0;

  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: ReseniaService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data: Resenia[]) => {
      this.resDataSource = new MatTableDataSource<Resenia>(data);
      this.resDataSource.filterPredicate = (data: Resenia, filter: string) => {
        const f = filter.trim().toLowerCase();
        return data.contentResenia.toLowerCase().includes(f)
          || data.usuario.username.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.rS.getList().subscribe((data: Resenia[]) => {
      this.resDataSource = new MatTableDataSource<Resenia>(data);
      this.resDataSource.filterPredicate = (data: Resenia, filter: string) => {
        const f = filter.trim().toLowerCase();
        return data.contentResenia.toLowerCase().includes(f)
          || data.usuario.username.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });
  }

  ngAfterViewInit() {
    this.resDataSource.paginator = this.paginator;
  }

  resAplicarFiltro() {
    this.resDataSource.filter = this.resFiltro.trim().toLowerCase();
    this.totalRegistros = this.resDataSource.filteredData.length;
    if (this.resDataSource.paginator) {
      this.resDataSource.paginator.firstPage();
    }
  }

  sumarLike(res: Resenia) {
    res.likesResenia++;
  }

  eliminar(id: number) {
    this.rS.deleteA(id).subscribe({
      next: () => {
        this.rS.list().subscribe(list => {
          this.rS.setList(list);
          this.totalRegistros = list.length;
        });
      },
      error: err => {
        this.snackBar.open(
          'No se puede eliminar: esta reseña está enlazada con otra entidad.',
          'Cerrar',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      }
    });
  }

  get reseniasPaginadas() {
    const start = this.paginaActual * this.pageSize;
    const end = start + this.pageSize;
    return this.resDataSource.filteredData.slice(start, end);
  }

  cambiarPagina(event: PageEvent) {
    this.paginaActual = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
