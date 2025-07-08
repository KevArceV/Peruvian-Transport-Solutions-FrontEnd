import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";
import { Usuario } from "../models/Usuarios";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${base_url}/usuarios`;

  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Usuario[]>(`${this.url}/listar`)
  }
  
  insert(u:Usuario){
    return this.http.post(`${this.url}/insertar`, u);
  }
  setList(listaNueva:Usuario[]){
    this.listaCambio.next(listaNueva)
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/listar/${id}`);
  }

  update(u: Usuario) {
    return this.http.put(`${this.url}/modificar`, u);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
 
}
