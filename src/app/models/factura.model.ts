import { Producto } from "./producto.model"

export interface Factura {
  DETALLES: Producto[],
  FACTURA: {
    TOTAL: number,
    FECHA: string,
    NUMERO_FACTURA: number,
    USUARIO:  string
  }
}
