import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Roles } from '../../../models/Role';
import { Usuario } from '../../../models/Usuarios';
import { RolService } from '../../../services/Rol.service';
import { UsuarioService } from '../../../services/Usuario.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-insertarrol',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './insertarrol.component.html',
  styleUrl: './insertarrol.component.css'
})
export class InsertarrolComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  rol: Roles = new Roles();
  edicion: boolean = false;
  id: number = 0;

  listaUsuarios: Usuario[] = [];
  opciones = [
    { value: 'ADMINISTRADOR', viewValue: 'ADMINISTRADOR' },
    { value: 'TURISTA', viewValue: 'TURISTA' },
    { value: 'CONDUCTOR', viewValue: 'CONDUCTOR' }
  ];

  constructor(
    private rS: RolService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private uS: UsuarioService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      usuario: ['', Validators.required]
    });

    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.rol.id = this.form.value.id;
      this.rol.rol = this.form.value.nombre;

      const request = this.edicion
        ? this.rS.update(this.rol)
        : this.rS.insert(this.rol);

      request.subscribe(() => {
        this.rS.list().subscribe(data => {
          this.rS.setList(data);
          this.router.navigate(['rutaRol']);
        });
      });
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          id: [data.id],
          nombre: [data.rol, Validators.required],
        });
      });
    }
  }
}
