import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListaritemComponent } from '../item/listaritem/listaritem.component';

@Component({
  selector: 'app-item',
  imports: [RouterOutlet, ListaritemComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  constructor(public route:ActivatedRoute) {}

}


