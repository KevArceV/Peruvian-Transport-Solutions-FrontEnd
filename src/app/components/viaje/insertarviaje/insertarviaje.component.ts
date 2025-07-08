import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ruta } from '../../../models/Ruta';
import { RutaService } from '../../../services/Ruta.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Viaje } from '../../../models/Viaje';
import { ViajeService } from '../../../services/Viaje.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-insertarviaje',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, NgxCurrencyDirective],
  templateUrl: './insertarviaje.component.html',
  styleUrl: './insertarviaje.component.css'
})
export class InsertarviajeComponent implements OnInit{
  form:FormGroup = new FormGroup({});
  id: number = 0
  edicion: boolean = false;
  viaje:Viaje=new Viaje();
  arrivalAddressBus: string = ""
  departureDateViaje:string=""
  priceViaje:number=0
  departureTimeViaje:string=""
  listaRuta:Ruta[]=[]

  constructor(
    private formBuilder: FormBuilder,
    private vS: ViajeService,
    private router:Router,
    private rS:RutaService,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
  // 1) Inicializas el form (¡una sola vez!)
  this.form = this.formBuilder.group({
    departureDateViaje: ['', Validators.required],
    arrivalAddressBus: ['', Validators.required],
    priceViaje:         ['', Validators.required],
    departureTimeViaje: ['', Validators.required],
    ruta:               ['', Validators.required]
  });

  // 2) Cargas la lista de rutas
  this.rS.list().subscribe(lista => this.listaRuta = lista);

  // 3) Te suscribes a params y, si es edición, haces patch
  this.route.params.subscribe((params: Params) => {
    this.id = params['id'];
    this.edicion = this.id != null;
    if (this.edicion) {
      this.vS.listId(this.id).subscribe(data => {
        this.form.patchValue({
          departureDateViaje: data.departureDateViaje,
          arrivalAddressBus: data.arrivalAddressBus,
          priceViaje:         data.priceViaje,
          departureTimeViaje: data.departureTimeViaje,
          ruta:               data.ruta.idRuta    // <- aquí sólo el ID
        });
      });
    }
  });
}


  aceptar() {
  if (this.form.invalid) return;

  const fv = this.form.value;
  // Inicializo el objeto viaje (con su ID si es edición)
  this.viaje = new Viaje();
  if (this.edicion) { this.viaje.idViaje = this.id; }

  this.viaje.departureDateViaje = fv.departureDateViaje;
  this.viaje.priceViaje         = fv.priceViaje;
  this.viaje.departureTimeViaje = fv.departureTimeViaje;
  this.viaje.arrivalAddressBus = this.form.value.arrivalAddressBus;


  // Inicializo la ruta y le asigno el id
  this.viaje.ruta = new Ruta();
  this.viaje.ruta.idRuta = fv.ruta;

  const request = this.edicion
    ? this.vS.update(this.viaje)
    : this.vS.insert(this.viaje);

  request.subscribe(() => {
    this.vS.list().subscribe(data => {
      this.vS.setList(data);
      this.router.navigate(['rutaViaje']);
    });
  });
}

  init() {
    if (this.edicion) {
      this.vS.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          id: [data.idViaje],
          departureDateViaje: [data.departureDateViaje, Validators.required],
          priceViaje: [data.priceViaje, Validators.required],
          departureTimeViaje: [data.departureTimeViaje, Validators.required],
          arrivalAddressBus: [data.arrivalAddressBus, Validators.required],
          ruta: [data.ruta, Validators.required],

        });
      });
    }
  }


}
