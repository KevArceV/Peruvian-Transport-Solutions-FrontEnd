import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(request: JwtRequest) {
    return this.http.post('https://peruvian-transport-solutions-6ncr.onrender.com/login', request);
  }

  verificar() {
    if (isPlatformBrowser(this.platformId)) {
      let token = sessionStorage.getItem('token');
      return token != null;
    }
    return false; // en SSR asumimos que no está logueado
  }

  showRole() {
    if (isPlatformBrowser(this.platformId)) {
      let token = sessionStorage.getItem('token');
      if (!token) {
        return null;
      }
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken?.role;
    }
    return null;
  }

  showUser(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('token');
      if (!token) return null;
      const helper = new JwtHelperService();
      const decoded: any = helper.decodeToken(token);
      return decoded?.username || decoded?.sub || decoded?.name || null;
    }
    return null;
  }
}
