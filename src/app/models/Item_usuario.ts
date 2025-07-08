import { Item } from "./Item"
import { Usuario } from "./Usuarios"

export class Item_usuario{
    idItemUsuario: number = 0
    travelQualificationItemUsuario: number = 0
    travelDateItemUsuario: string = ""
    item: Item = new Item()
    usuario: Usuario = new Usuario()
}