import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";
import { Resenia } from "../models/Resenia";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class ReseniaService {
  private url = `${base_url}/Resenia`;
  private listaCambio = new Subject<Resenia[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Resenia[]>(`${this.url}/listar`)
  }
   insert(r:Resenia){
      return this.http.post(`${this.url}/insertar`, r);
    }
    setList(listaNueva:Resenia[]){
      this.listaCambio.next(listaNueva)
    }
    getList(){
      return this.listaCambio.asObservable()
    }
     listId(id: number) {
      return this.http.get<Resenia>(`${this.url}/${id}`);
    }
  
    update(r:Resenia) {
      return this.http.put(`${this.url}/modificar`, r);
    }
  
    deleteA(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }
}