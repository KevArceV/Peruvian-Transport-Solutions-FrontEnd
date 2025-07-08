import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} 
from '@angular/forms';
import { Pago } from '../../../models/Pago';
import { PagoService } from '../../../services/Pago.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-insertarpago',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule],  templateUrl: './insertarpago.component.html',
  styleUrl: './insertarpago.component.css'
})
export class InsertarpagoComponent implements OnInit{
  
  form: FormGroup = new FormGroup({});
  pago: Pago = new Pago();
  edicion: boolean = false;
  id: number = 0
  types:{value:string;viewValue:string}[]=[
    {value:"Plin",viewValue:"Plin"},
    {value:"Yape",viewValue:"Yape"},
    {value:"Tarjeta",viewValue:"Tarjeta"},
    {value:"Efectivo",viewValue:"Efectivo"},

  ]
    constructor(
    private aS: PagoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route:ActivatedRoute
  ) {}
  ngOnInit(): void { //se ejecuta primero
    this.route.params.subscribe((data:Params)=>{
      this.id=data['id']
      this.edicion=data['id']!=null //boleano
      //actualiza y trae la data
      this.init()
    });
    this.form = this.formBuilder.group({
      id:[''],
      type: ['', Validators.required],
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.pago.idPago = this.form.value.id;
      this.pago.paymentTypePago = this.form.value.type;

      const request = this.edicion
        ? this.aS.update(this.pago)
        : this.aS.insert(this.pago);

      request.subscribe(() => {
        this.aS.list().subscribe(data => {
          this.aS.setList(data);
          this.router.navigate(['rutaPago']);
        });
      });
    }
  }

  init() {
    if (this.edicion) {
      this.aS.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          id: [data.idPago],
          type: [data.paymentTypePago, Validators.required]
        });
      });
    }
  }

}
