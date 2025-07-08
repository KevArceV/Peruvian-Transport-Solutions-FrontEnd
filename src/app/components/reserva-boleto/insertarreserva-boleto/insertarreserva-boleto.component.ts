import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { Reserva_boleto } from '../../../models/Reserva_boleto';
import { Usuario }        from '../../../models/Usuarios';
import { Pago }           from '../../../models/Pago';
import { Asiento }        from '../../../models/Asiento';

import { ReservaBoletoService } from '../../../services/Reserva_boleto.service';
import { UsuarioService }       from '../../../services/Usuario.service';
import { PagoService }          from '../../../services/Pago.service';
import { AsientoService }       from '../../../services/Asiento.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-insertarreserva-boleto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule, NgxCurrencyDirective
  ],
  templateUrl: './insertarreserva-boleto.component.html',
  styleUrls: ['./insertarreserva-boleto.component.css']
})
export class InsertarreservaBoletoComponent implements OnInit {
  form!: FormGroup;
  id = 0;
  edicion: boolean = false;
  reserva:Reserva_boleto = new Reserva_boleto();
  ticketAmountReservaBoleto: number=0;
  seatQuantityReservaBoleto: number=0;
  listaUsuarios: Usuario[] = [];
  listaPago:     Pago[]    = [];
  listaAsiento:  Asiento[] = [];

  types: { value: string; viewValue: string }[] = [
    { value: 'Efectivo', viewValue: 'Efectivo' },
    { value: 'Tarjeta', viewValue: 'Tarjeta' },
    { value: 'Plin', viewValue: 'Plin' },
    { value: 'Yape', viewValue: 'Yape' }
  ];
  constructor(
    private fb: FormBuilder,
    private rB: ReservaBoletoService,
    private uS: UsuarioService,
    private pS: PagoService,
    private aS: AsientoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    /* 1. FormGroup */
    this.form = this.fb.group({
      ticketAmountReservaBoleto: ['', Validators.required],
      seatQuantityReservaBoleto: ['', Validators.required],
      usuario:  ['', Validators.required],
      pago:     ['', Validators.required],
      asiento:  ['', Validators.required]
    });

    /* 2. Tablas para selects */
    this.uS.list().subscribe(d => (this.listaUsuarios = d));
    this.aS.list().subscribe(d => (this.listaAsiento = d));

    /* 3. ¿Modo edición? */
    this.route.params.subscribe((params: Params) => {
      this.id      = params['id'];
      this.edicion = this.id != null;

      if (this.edicion) {
        this.rB.listId(this.id).subscribe(data => {
          this.form.patchValue({
            ticketAmountReservaBoleto: data.ticketAmountReservaBoleto,
            seatQuantityReservaBoleto: data.seatQuantityReservaBoleto,
            usuario:  data.usuario.idUsuario,          // usa la clave real de Usuario
            pago:     data.pago.paymentTypePago,
            asiento:  data.asiento.idAsiento
          });
        });
      }
    });
  }

  aceptar(): void {
    if (this.form.invalid) return;

    const fv = this.form.value;

    /* Ensambla la entidad */
    this.reserva = new Reserva_boleto();
    if (this.edicion) { this.reserva.idReservaBoleto = this.id; }

    this.reserva.ticketAmountReservaBoleto = fv.ticketAmountReservaBoleto;
    this.reserva.seatQuantityReservaBoleto = fv.seatQuantityReservaBoleto;

    this.reserva.usuario  = new Usuario();
    this.reserva.usuario.idUsuario = fv.usuario

    this.reserva.pago = new Pago();
    this.reserva.pago.idPago = this.edicion ? fv.pago.idPago : 0;  // Si es edición, asigna fv.pago.idPago, sino asigna 0
    this.reserva.pago.paymentTypePago = fv.pago;  // Asigna el paymentTypePago tal como está

    
    this.reserva.asiento  = new Asiento();
    this.reserva.asiento.idAsiento  = fv.asiento

    const req$ = this.edicion
      ? this.rB.update(this.reserva)
      : this.rB.insert(this.reserva);

    req$.subscribe(() => {
      this.rB.list().subscribe(lista => {
        this.rB.setList(lista);
        this.router.navigate(['rutaReservaBoleto']);
      });
    });
  }
}
