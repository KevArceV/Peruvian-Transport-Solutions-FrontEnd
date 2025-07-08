import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";
import { Bus } from "../models/Bus";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private url = `${base_url}/buses`;
  private listaCambio = new Subject<Bus[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Bus[]>(`${this.url}/listar`)
  }

  insert(b: Bus){
    return this.http.post(`${this.url}/insertar`, b);
  }

  setList(listaNueva: Bus[]){
    this.listaCambio.next(listaNueva);
  }

  getList(){
    return this.listaCambio.asObservable();
  }

  listId(id: number){
      return this.http.get<Bus>(`${this.url}/listar/${id}`);
  }

  update(b: Bus){
   return this.http.put(`${this.url}/modificar`, b);
  }

  deleteI(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }
}