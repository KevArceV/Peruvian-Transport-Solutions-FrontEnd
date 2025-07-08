import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";
import { Item } from "../models/Item";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private url = `${base_url}/item`;
  private listaCambio = new Subject<Item[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Item[]>(`${this.url}/listar`)
  }

  insert(item: Item) {
    return this.http.post(`${this.url}/insertar`, item);
  }

  setList(listaNueva:Item[]){
    this.listaCambio.next(listaNueva)
  }

  update(item: Item) {
    return this.http.put(`${this.url}/modificar`, item);
  }

  deleteI(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Item>(`${this.url}/listar/${id}`);
  }

  getList() {
    return this.listaCambio.asObservable();
  }



}





