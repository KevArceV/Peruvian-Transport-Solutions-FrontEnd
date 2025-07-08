import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bus } from '../../../models/Bus';
import { Viaje } from '../../../models/Viaje';
import { BusService } from '../../../services/Bus.service';

import { ViajeService } from '../../../services/Viaje.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-insertarbus',
  imports: [ReactiveFormsModule,MatFormField,MatInputModule,CommonModule,MatButtonModule,MatSelectModule, MatIconModule],
  templateUrl: './insertarbus.component.html',
  styleUrl: './insertarbus.component.css'
})
export class InsertarbusComponent implements OnInit{
   form:FormGroup = new FormGroup({});
  id: number = 0
  edicion: boolean = false;
  bus:Bus=new Bus();
  listaViaje:Viaje[]=[]
  capacityBus: number = 0
  durationBus: string = ""
  
   constructor(
    private formBuilder: FormBuilder,
    private bS: BusService,
    private router:Router,
    private vS:ViajeService,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
     this.form = this.formBuilder.group({
      capacityBus: ['', Validators.required],
      durationBus: ['', Validators.required],
      viaje: ['', Validators.required],
    });
     this.vS.list().subscribe(data=>{
        this.listaViaje=data
      })
    this.route.params.subscribe((params: Params) => {
    this.id = params['id'];
    this.edicion = this.id != null;
    if (this.edicion) {
      this.bS.listId(this.id).subscribe(data => {
        this.form.patchValue({
          capacityBus:         data.capacityBus,
          durationBus: data.durationBus,
          viaje:               data.viaje.idViaje    // <- aquí sólo el ID
        });
      });
    }
  });
    
  }

  aceptar() {
  if (this.form.invalid) return;

  const fv = this.form.value;
  this.bus = new Bus();
  if (this.edicion) {
    this.bus.idBus = this.id;
  }
  this.bus.capacityBus = fv.capacityBus;
  this.bus.durationBus = fv.durationBus;
  this.bus.viaje = new Viaje();
  this.bus.viaje.idViaje = fv.viaje;

  const request$ = this.edicion
    ? this.bS.update(this.bus)
    : this.bS.insert(this.bus);

  request$.subscribe(() => {
    // *** Aquí refrescas la lista igual que en el insert ***
    this.bS.list().subscribe(lista => {
      this.bS.setList(lista);
      // Una vez hecho el setList, ya navegas
      this.router.navigate(['rutaBus']);
    });
  });
}

  

  init() {
    if (this.edicion) {
      this.bS.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          id: [data.idBus],
          capacityBus: [data.capacityBus, Validators.required],
          durationBus: [data.durationBus, Validators.required],
          viaje: [data.viaje, Validators.required],

        });
      });
    }
  }



}
