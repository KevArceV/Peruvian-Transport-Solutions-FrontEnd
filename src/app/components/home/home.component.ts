import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {  MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
     MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterLink, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
   heroTitle    = '¡Visita a los mejores lugares del Perú!';
  heroQuote    = '"Explora Perú como nunca antes: seguro, cómodo y a tu ritmo"';
  heroSubtitle = 'Reserva tu próxima aventura desde Lima hacia destinos inolvidables.';
  ctaLabel     = 'TRAZA TU RUTA';
  busImage     = 'assets/images/bus.png';
  mapImage     = 'assets/images/mapa-peru.png';

  isLoggedIn = false;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Comprueba al inicio si hay token en sessionStorage
    this.isLoggedIn = this.loginService.verificar();
  }

}

