import { Bus } from "./Bus"
import { Estado } from "./Estado"

export class Asiento{
    idAsiento: number = 0
    seatNumberAsiento: number = 0
    bus: Bus = new Bus()
    estado: Estado = new Estado()
}