import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { Asiento } from "../models/Asiento";
import { HttpClient } from "@angular/common/http";
import { CantidadAsientosDTO } from "../models/CantidadAsientosDTO";

const base_url = environment.base

@Injectable({
    providedIn: 'root',
})

export class AsientoService{
    private url = `${base_url}/asientos`;
    private listaCambio = new Subject<Asiento[]>()
    constructor(private http:HttpClient){}

    list(){
      return this.http.get<Asiento[]>(`${this.url}/listar`)
    }

    insert(asiento: Asiento) {
      return this.http.post(`${this.url}/insertar`, asiento);
    }

    getList() {
      return this.listaCambio.asObservable();
    }

    setList(listaNueva: Asiento[]) {
      this.listaCambio.next(listaNueva);
    }

    update(asiento: Asiento) {
      return this.http.put(`${this.url}/modificar`, asiento);
    }
      
    deleteI(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
      
    listId(id: number) {
      return this.http.get<Asiento>(`${this.url}/listar/${id}`);
    }

    getQuantitySeatsPerBus():Observable<CantidadAsientosDTO[]>{
      return this.http.get<CantidadAsientosDTO[]>(`${this.url}/cantidadAsientosPorBus`);
    }
}