import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Estado } from '../../../models/Estado';
import { EstadoService } from '../../../services/Estado.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-insertarestado',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './insertarestado.component.html',
  styleUrl: './insertarestado.component.css',
})
export class InsertarestadoComponent implements OnInit {
  form!: FormGroup;
  estado: Estado = new Estado();
  edicion = false;
  id = 0;

  types = [
    { value: 'Disponible', viewValue: 'Disponible' },
    { value: 'Ocupado', viewValue: 'Ocupado' },
  ];

  constructor(
    private estadoService: EstadoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      type: ['', Validators.required],
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = !!this.id;
      this.init();
    });
  }

  init() {
    if (this.edicion) {
      this.estadoService.listId(this.id).subscribe(data => {
        this.form.patchValue({
          id: data.idEstado,
          type: data.statusTypeEstado,
        });
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      const estado: Estado = {
        idEstado: this.form.value.id,
        statusTypeEstado: this.form.value.type,
      };

      const request = this.edicion
        ? this.estadoService.update(estado)
        : this.estadoService.insert(estado);

      request.subscribe(() => {
        this.estadoService.list().subscribe(data => {
          this.estadoService.setList(data);
          this.router.navigate(['/rutaEstado']);
        });
      });
    }
  }
}
