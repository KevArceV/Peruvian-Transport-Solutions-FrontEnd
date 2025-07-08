import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject, Observable } from "rxjs";
import { Reserva_boleto } from "../models/Reserva_boleto";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class ReservaBoletoService {
  private url = `${base_url}/reservas`;
  private listaCambio = new Subject<Reserva_boleto[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Reserva_boleto[]>(`${this.url}/listar`)
  }
   insert(r:Reserva_boleto){
      return this.http.post(`${this.url}/insertar`, r);
    }
    setList(listaNueva:Reserva_boleto[]){
      this.listaCambio.next(listaNueva)
    }
    getList(){
      return this.listaCambio.asObservable()
    }
     listId(id: number) {
      return this.http.get<Reserva_boleto>(`${this.url}/listar/${id}`);
    }
  
    update(r:Reserva_boleto) {
      return this.http.put(`${this.url}/modificar`, r);
    }
  
    deleteA(id: number) {
      return this.http.delete(`${this.url}/${id}`);
    }

    // src/app/services/reserva-boleto.service.ts
    listByAmount(amount: number) {
      return this.http.get<Reserva_boleto[]>(
        `${this.url}/monto-mayor-a/${amount}`
      );
    }
}