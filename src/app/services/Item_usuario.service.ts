import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { Item_usuario } from "../models/Item_usuario";
import { HttpClient } from "@angular/common/http";
import { ItemusuariotopDTO } from "../models/ItemUsuariotopDTO";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class Item_usuarioService {
  private url = `${base_url}/item_usuario`;
  private listaCambio = new Subject<Item_usuario[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Item_usuario[]>(`${this.url}/listar`)
  }

  insert(itemusuario: Item_usuario) {
          return this.http.post(`${this.url}/insertar`, itemusuario);
        }
         getList() {
          return this.listaCambio.asObservable();
        }
          setList(listaNueva: Item_usuario[]) {
          this.listaCambio.next(listaNueva);
        }
      update(itemusuario: Item_usuario) {
            return this.http.put(`${this.url}/modificar`, itemusuario);
          }
        
          deleteI(id: number) {
            return this.http.delete(`${this.url}/${id}`);
          }
        
          listId(id: number) {
            return this.http.get<Item_usuario>(`${this.url}/listar/${id}`);
          }
          getTOP():Observable<ItemusuariotopDTO[]>{
              return this.http.get<ItemusuariotopDTO[]>(`${this.url}/topCalificados`);
            }
}