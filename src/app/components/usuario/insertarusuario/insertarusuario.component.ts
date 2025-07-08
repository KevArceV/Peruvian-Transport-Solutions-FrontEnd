import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Usuario } from '../../../models/Usuarios';
import { UsuarioService } from '../../../services/Usuario.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Roles } from '../../../models/Role';
import { RolService } from '../../../services/Rol.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // en AppModule


@Component({
  selector: 'app-insertarusuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, BrowserAnimationsModule
  ],
  templateUrl: './insertarusuario.component.html',
  styleUrl: './insertarusuario.component.css',
})
export class InsertarusuarioComponent implements OnInit {
  usuarioForm: FormGroup = new FormGroup({});
  roles: Roles[] = [];
  usuario: Usuario = new Usuario();
  usuarioId: number = 0;
  edicion: boolean = false;
  listaRol:Roles[]=[]
  usNombre: string="";
    usApellido: string="";
    usFecNacimiento:Date=new Date();
    usCorreo: string="";
    username: string="";
    password: string="";
    usEnable: boolean=false;

  constructor(
    private uS: UsuarioService,
    private rS: RolService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      id: [''], // opcional
      usNombre: [[], Validators.required],
      usApellido: [[], Validators.required],
      usFecNacimiento: [[], Validators.required],
      usCorreo: [[], Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [[], Validators.required],
      usEnable: [true, Validators.required],
    });

    this.rS.list().subscribe((rolesData) => {
       this.roles = rolesData;
    });

    this.route.params.subscribe((params: Params) => {
      this.usuarioId = params['id'];
      this.edicion = this.usuarioId != null;
    if (this.edicion) {
      this.uS.listId(this.usuarioId).subscribe(data => {
        this.usuarioForm.patchValue({
          usNombre: data.usNombre,
          usApellido: data.usApellido,
          usFecNacimiento:         data.usFecNacimiento,
          usCorreo: data.usCorreo,
          username: data.username,
          password: data.password,
          roles: data.role.rol,
          usEnable: data.usEnable   // <- aquí sólo el ID
        });
      });
    }
  });
}


  init() {
    if (this.edicion) {
      this.uS.listId(this.usuarioId).subscribe((data) => {
        this.usuarioForm = this.formBuilder.group({
          id: [data.idUsuario], // para pasar el id al actualizar
          usNombre: [data.usNombre, Validators.required],
      usApellido: [data.usApellido, Validators.required],
      usFecNacimiento:[data.usFecNacimiento, Validators.required],
      usCorreo:[data.usCorreo, Validators.required],
          username: [data.username, [Validators.required, Validators.minLength(4)]],
          password: [data.password, [Validators.required, Validators.minLength(6)]],
          roles: [data.role, Validators.required],
          usEnable: [data.usEnable, Validators.required],
        });
      });
    }
  }

  aceptar() {
    if (this.usuarioForm.invalid) return;

    const fv = this.usuarioForm.value;
      // Inicializo el objeto viaje (con su ID si es edición)
      this.usuario = new Usuario();
      if (this.edicion) { this.usuario.idUsuario = this.usuarioId; }

      this.usuario.usNombre = fv.usNombre;
  this.usuario.usApellido = fv.departureDateViaje;
  this.usuario.usFecNacimiento = fv.usFecNacimiento;
  this.usuario.usCorreo = fv.usCorreo;
  this.usuario.username = fv.username;
  this.usuario.password = fv.password;
  this.usuario.usEnable = fv.usEnable;

  // Inicializo la ruta y le asigno el id
    this.usuario.role = new Roles();
    this.usuario.role.rol = fv.roles;
  
const request = this.edicion
    ? this.uS.update(this.usuario)
    : this.uS.insert(this.usuario);

  request.subscribe(() => {
    this.uS.list().subscribe(data => {
      this.uS.setList(data);
      this.router.navigate(['rutaUsuario']);
    });
  });
}
}
