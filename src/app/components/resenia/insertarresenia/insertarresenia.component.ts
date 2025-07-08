import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Resenia } from '../../../models/Resenia';
import { Usuario } from '../../../models/Usuarios';
import { Viaje } from '../../../models/Viaje';
import { ReseniaService } from '../../../services/Resenia.service';
import { UsuarioService } from '../../../services/Usuario.service';
import { ViajeService } from '../../../services/Viaje.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

// validador de hora futura
export function futureTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const now = new Date();
    let hour = 0;
    let minute = 0;

    if (typeof control.value === 'string') {
      [hour, minute] = control.value.split(':').map(Number);
    } else if (control.value instanceof Date) {
      hour = control.value.getHours();
      minute = control.value.getMinutes();
    } else {
      return null;
    }

    const inputTime = new Date();
    inputTime.setHours(hour, minute, 0, 0);

    return inputTime <= now ? { notFutureTime: true } : null;
  };
}

@Component({
  selector: 'app-insertarresenia',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTimepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './insertarresenia.component.html',
  styleUrl: './insertarresenia.component.css'
})
export class InsertarreseniaComponent implements OnInit {
  resForm: FormGroup = new FormGroup({});
  resenia: Resenia = new Resenia();
  edicion: boolean = false;
  id: number = 0;
  listaUsuarios: Usuario[] = [];
  listaViajes: Viaje[] = [];

  constructor(
    private rS: ReseniaService,
    private uS: UsuarioService,
    private vS: ViajeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.init();
    });

    this.resForm = this.formBuilder.group({
      id: [''],
      contentResenia: ['', Validators.required],
      publicationDateResenia: ['', [
        Validators.required,
        futureTimeValidator()
      ]],
      likesResenia: [0],
      usuario: ['', Validators.required],
      viaje: ['', Validators.required],
    });

    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.vS.list().subscribe(data => this.listaViajes = data);
  }

  aceptar() {
  if (this.resForm.valid) {
    // SIEMPRE usar el id desde la variable de clase, no del form
    this.resenia.idResenia = this.id;   // usa el id que vino en la ruta
    this.resenia.contentResenia = this.resForm.value.contentResenia;

    const horaCompleta = this.resForm.value.publicationDateResenia;
    if (horaCompleta instanceof Date) {
      this.resenia.publicationDateResenia = horaCompleta.toLocaleTimeString('en-GB', { hour12: false });
    } else if (typeof horaCompleta === 'string' && horaCompleta.length >= 5) {
      this.resenia.publicationDateResenia = horaCompleta + ':00';
    } else {
      this.resenia.publicationDateResenia = '00:00:00';
    }

    this.resenia.likesResenia = this.resForm.value.likesResenia;
    this.resenia.usuario = { idUsuario: this.resForm.value.usuario } as Usuario;
    this.resenia.viaje = { idViaje: this.resForm.value.viaje } as Viaje;

    const request = this.edicion
      ? this.rS.update(this.resenia)
      : this.rS.insert(this.resenia);

    request.subscribe(() => {
      this.rS.list().subscribe(data => {
        this.rS.setList(data);
        this.snackBar.open(this.edicion ? 'Se actualizó correctamente' : 'Se registró correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.router.navigate(['rutaResenia']);
      });
    });
  }
}


  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe(data => {
        this.resForm = this.formBuilder.group({
          id: [data.idResenia],
          contentResenia: [data.contentResenia, Validators.required],
          publicationDateResenia: [data.publicationDateResenia, [
            Validators.required,
            futureTimeValidator()
          ]],
          likesResenia: [data.likesResenia],
          usuario: [data.usuario?.idUsuario, Validators.required],
          viaje: [data.viaje?.idViaje, Validators.required],
        });
      });
    }
  }
}
