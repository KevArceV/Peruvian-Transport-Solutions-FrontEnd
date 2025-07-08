import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/Item.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listaritem',
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
  templateUrl: './listaritem.component.html',
  styleUrl: './listaritem.component.css'
})
export class ListaritemComponent implements AfterViewInit {

  dataSource: MatTableDataSource<Item> = new MatTableDataSource();
  filtro: string = '';
  totalRegistros: number = 0;

  paginaActual = 0;
  pageSize = 4;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.list().subscribe((data: Item[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (item: Item, filter: string) => {
        const f = filter.trim().toLowerCase();
        return item.idItem.toString().includes(f) ||
               item.titleItem.toLowerCase().includes(f) ||
               item.descriptionItem.toLowerCase().includes(f) ||
               item.formatItem.toLowerCase().includes(f);
      };
      this.totalRegistros = data.length;
    });

    this.itemService.getList().subscribe((data: Item[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (item: Item, filter: string) => {
        const f = filter.trim().toLowerCase();
        return item.idItem.toString().includes(f) ||
               item.titleItem.toLowerCase().includes(f) ||
               item.descriptionItem.toLowerCase().includes(f) ||
               item.formatItem.toLowerCase().includes(f);
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
    this.itemService.deleteI(id).subscribe(() => {
      this.itemService.list().subscribe((data: Item[]) => {
        this.itemService.setList(data);
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
