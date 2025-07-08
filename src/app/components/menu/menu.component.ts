import { Component, HostListener, OnInit }     from '@angular/core';
import { RouterLink }                  from '@angular/router';
import { CommonModule }                from '@angular/common';
import { MatToolbarModule }            from '@angular/material/toolbar';
import { MatMenuModule }               from '@angular/material/menu';
import { MatIconModule }               from '@angular/material/icon';
import { MatButtonModule }             from '@angular/material/button';
import { MatTooltipModule }            from '@angular/material/tooltip';
import { LoginService }                from '../../services/login.service';
import {
  trigger, state, style,
  transition, animate
} from '@angular/animations';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ]),
    ]),
    trigger('rotateIcon', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open',   style({ transform: 'rotate(180deg)' })),
      transition('closed <=> open', animate('200ms ease-out')),
    ]),
  ]
})
export class MenuComponent implements OnInit{
  role = '';
  usuario: string | null = null;
  public logoutMenuOpen = false;

  constructor(private loginService: LoginService) {}

  cerrar() {
    sessionStorage.clear();
  }
   ngOnInit() {
    if (this.loginService.verificar()) {
      this.role    = this.loginService.showRole()    ?? '';
      this.usuario = this.loginService.showUser();
      console.log('MenuComponent → usuario:', this.usuario, 'role:', this.role);
    }
  }

  verificar() {
     this.role    = this.loginService.showRole() ?? '';
    this.usuario = this.loginService.showUser();
    return this.loginService.verificar();
  }

  isAdministrador() {
    return this.role === 'ADMINISTRADOR';
  }
  isTurista() {
    return this.role === 'TURISTA';
  }
  isConductor() {
    return this.role === 'CONDUCTOR';
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const current = window.pageYOffset;
    this.isVisible = current < this.lastScroll;
    this.lastScroll = current;
  }

  isVisible = true;
  private lastScroll = 0;
}
