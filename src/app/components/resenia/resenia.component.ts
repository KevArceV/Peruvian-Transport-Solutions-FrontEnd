import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarreseniaComponent } from './listarresenia/listarresenia.component';

@Component({
  selector: 'app-resenia',
  imports: [RouterOutlet,ListarreseniaComponent],
  templateUrl: './resenia.component.html',
  styleUrl: './resenia.component.css'
})
export class ReseniaComponent {
constructor(public route:ActivatedRoute) {}
}
