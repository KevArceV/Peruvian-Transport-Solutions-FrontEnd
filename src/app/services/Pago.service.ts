import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { Pago } from "../models/Pago";
import { HttpClient } from "@angular/common/http";
import { PaymentsByTypeDTO } from "../models/PaymentsByTypeDTO";

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private url = `${base_url}/payments`;
  private listaCambio = new Subject<Pago[]>();
  constructor(private http: HttpClient) {}

  list(){
    return this.http.get<Pago[]>(`${this.url}/listar`)
  }
  insert(pago: Pago) {
    return this.http.post(`${this.url}/insertar`, pago);
  }

  setList(listaNueva:Pago[]){
    this.listaCambio.next(listaNueva)
  }

  update(pago: Pago) {
    return this.http.put(`${this.url}/modificar`, pago);
  }

  deleteP(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Pago>(`${this.url}/listar/${id}`);
  }

  getList() {
    return this.listaCambio.asObservable();
  }
  getPaymentsByType():Observable<PaymentsByTypeDTO[]>{
    return this.http.get<PaymentsByTypeDTO[]>(`${this.url}/paymentsByType`);
  }
}