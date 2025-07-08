import { Asiento } from "./Asiento"
import { Pago } from "./Pago"
import { Usuario } from "./Usuarios"

export class Reserva_boleto{
    idReservaBoleto: number = 0
    ticketAmountReservaBoleto: number = 0
    seatQuantityReservaBoleto: number = 0
    usuario: Usuario = new Usuario()
    pago: Pago = new Pago()
    asiento: Asiento = new Asiento()
}