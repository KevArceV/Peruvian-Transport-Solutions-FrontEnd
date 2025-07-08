import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarbusComponent } from './listarbus/listarbus.component';

@Component({
  selector: 'app-bus',
  imports: [RouterOutlet, ListarbusComponent],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css'
})
export class BusComponent {
  constructor(public route:ActivatedRoute){}
}
