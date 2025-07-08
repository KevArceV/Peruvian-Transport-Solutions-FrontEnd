import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { Viaje } from "../models/Viaje";
import { HttpClient } from "@angular/common/http";
import { ViajeByRutaDTO } from "../models/ViajeByRutaDTO";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private url = `${base_url}/viajes`;
  private listaCambio = new Subject<Viaje[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Viaje[]>(`${this.url}/listar`)
  }
  insert(viaje: Viaje) {
    return this.http.post(`${this.url}/insertar`, viaje);
  }
   getList() {
    return this.listaCambio.asObservable();
  }
    setList(listaNueva: Viaje[]) {
    this.listaCambio.next(listaNueva);
  }
  update(viaje: Viaje) {
    return this.http.put(`${this.url}/modificar`, viaje);
  }
  
  deleteI(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
  
  listId(id: number) {
    return this.http.get<Viaje>(`${this.url}/listar/${id}`);
  }

  getQuantity():Observable<ViajeByRutaDTO[]>{
    return this.http.get<ViajeByRutaDTO[]>(`${this.url}/viajePorRuta`);
  }
}