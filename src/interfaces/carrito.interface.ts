// Item del carrito de compra — coincide con la respuesta del backend
export interface CarritoItem {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number; // cantidad en el carrito
  foto: string | null;
}

// Para la respuesta de consulta del carrito
export interface CarritoResponse {
  items: CarritoItem[];
  total: number;
}
