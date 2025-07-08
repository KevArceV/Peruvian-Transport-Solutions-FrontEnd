import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Item_usuario } from '../../../models/Item_usuario';
import { Usuario } from '../../../models/Usuarios';
import { Item } from '../../../models/Item';
import { Item_usuarioService } from '../../../services/Item_usuario.service';
import { UsuarioService } from '../../../services/Usuario.service';
import { ItemService } from '../../../services/Item.service';

@Component({
  selector: 'app-insertaritemusuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './insertaritem-usiario.component.html',
  styleUrl: './insertaritem-usiario.component.css',
})
export class InsertaritemusuarioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  item_usuario: Item_usuario = new Item_usuario();
  edicion: boolean = false;
  id: number = 0;

  estrellas = [1, 2, 3, 4, 5];
  listausuarios: Usuario[] = [];
  listaitems: Item[] = [];

  constructor(
    private iuS: Item_usuarioService,
    private uS: UsuarioService,
    private iS: ItemService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      id: [''],
      travelQualificationItemUsuario: [0, Validators.required],
      travelDateItemUsuario: ['', Validators.required],
      item: ['', Validators.required],
      usuario: ['', Validators.required],
    });

    this.iS.list().subscribe((data) => {
      this.listaitems = data;
    });

    this.uS.list().subscribe((data) => {
      this.listausuarios = data;
    });
  }

  setRating(valor: number) {
    this.form.get('travelQualificationItemUsuario')?.setValue(valor);
  }

  aceptar() {
    if (this.form.valid) {
      this.item_usuario.idItemUsuario = this.form.value.id;
      this.item_usuario.travelQualificationItemUsuario = this.form.value.travelQualificationItemUsuario;
      this.item_usuario.travelDateItemUsuario = this.form.value.travelDateItemUsuario;

      this.item_usuario.item.idItem = this.form.value.item;
      this.item_usuario.usuario.idUsuario = this.form.value.usuario;

      const request = this.edicion
        ? this.iuS.update(this.item_usuario)
        : this.iuS.insert(this.item_usuario);

      request.subscribe(() => {
        this.iuS.list().subscribe((data) => {
          this.iuS.setList(data);
          this.router.navigate(['rutaItemUsuario']);
        });
      });
    }
  }

  init() {
    if (this.edicion) {
      this.iuS.listId(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          id: [data.idItemUsuario],
          travelQualificationItemUsuario: [data.travelQualificationItemUsuario, Validators.required],
          travelDateItemUsuario: [data.travelDateItemUsuario, Validators.required],
          item: [data.item.idItem, Validators.required],
          usuario: [data.usuario.idUsuario, Validators.required],
        });
      });
    }
  }
}
