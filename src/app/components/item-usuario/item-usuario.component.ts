import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListaritemusuarioComponent } from './listaritemusuario/listaritemusuario.component';

@Component({
  selector: 'app-item-usuario',
  imports: [RouterOutlet,ListaritemusuarioComponent],
  templateUrl: './item-usuario.component.html',
  styleUrl: './item-usuario.component.css'
})
export class ItemUsuarioComponent {
  constructor(public route:ActivatedRoute){}
}
