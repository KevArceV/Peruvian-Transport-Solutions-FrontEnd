import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";
import { Ruta } from "../models/Ruta";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  private url = `${base_url}/rutas`;
  private listaCambio = new Subject<Ruta[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Ruta[]>(`${this.url}/listar`)
  }

  insert(ruta: Ruta){
        return this.http.post(`${this.url}/insertar`, ruta);
    }
  
    setList(listaNueva:Ruta[]){
      this.listaCambio.next(listaNueva)
    }
  
    update(ruta: Ruta) {
      return this.http.put(`${this.url}/modificar`, ruta);
    }
  
    deleteI(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id: number) {
      return this.http.get<Ruta>(`${this.url}/listar/${id}`);
    }
  
    getList() {
      return this.listaCambio.asObservable();
    }
}