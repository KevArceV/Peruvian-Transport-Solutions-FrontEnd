import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Estado } from "../models/Estado";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private url = `${base_url}/estados`;
  private listaCambio = new Subject<Estado[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Estado[]>(`${this.url}/lista`)
  }
  

  insert(estado: Estado) {
    return this.http.post(`${this.url}/insertar`, estado);
  }

  setList(listaNueva:Estado[]){
    this.listaCambio.next(listaNueva)
  }

  update(estado: Estado) {
    return this.http.put(`${this.url}/modificar`, estado);
  }

  deleteP(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  //listId(id: number) {
    //return this.http.get<Estado>(`${this.url}/lista/${id}`);
  //}

  listId(id: number): Observable<Estado> {
  return this.http.get<Estado>(`${this.url}/listar/${id}`);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
}




