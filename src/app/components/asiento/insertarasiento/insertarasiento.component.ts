import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Asiento } from '../../../models/Asiento';
import { AsientoService } from '../../../services/Asiento.service';
import { Bus } from '../../../models/Bus';
import { Estado } from '../../../models/Estado';
import { BusService } from '../../../services/Bus.service';
import { EstadoService } from '../../../services/Estado.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-insertarasiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './insertarasiento.component.html',
  styleUrl: './insertarasiento.component.css'
})
export class InsertarasientoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  asiento: Asiento = new Asiento();
  edicion: boolean = false;
  id: number = 0;

  listaBuses: Bus[] = [];
  listaEstados: Estado[] = [];

  constructor(
    private aS: AsientoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private busService: BusService,
    private estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      id: [''],
      seatNumberAsiento: ['', Validators.required],
      bus: ['', Validators.required],
      estado: ['', Validators.required],
    });

    this.busService.list().subscribe((data) => {
      this.listaBuses = data;
    });

    this.estadoService.list().subscribe((data) => {
      this.listaEstados = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.asiento.idAsiento = this.form.value.id;
      this.asiento.seatNumberAsiento = this.form.value.seatNumberAsiento;

      this.asiento.bus = new Bus();
      this.asiento.bus.idBus = this.form.value.bus;

      this.asiento.estado = new Estado();
      this.asiento.estado.idEstado = this.form.value.estado;

      const request = this.edicion
        ? this.aS.update(this.asiento)
        : this.aS.insert(this.asiento);

      request.subscribe(() => {
        this.aS.list().subscribe((data) => {
          this.aS.setList(data);
          this.router.navigate(['rutaAsiento']);
        });
      });
    }
  }

  init() {
  if (this.edicion) {
    this.aS.listId(this.id).subscribe((data) => {
      this.form = this.formBuilder.group({
        id: [data.idAsiento],  // sin Validators
        seatNumberAsiento: [data.seatNumberAsiento, Validators.required],
        bus: [data.bus?.idBus, Validators.required],
        estado: [data.estado?.idEstado, Validators.required],
      });
    });
  }
}
}
