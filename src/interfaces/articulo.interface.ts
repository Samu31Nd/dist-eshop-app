// Coincide con Articulo.java — lo que regresa consulta_articulos
export interface Articulo {
  id_articulo: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  // Jackson serializa byte[] como string base64.
  // Para mostrarlo en un <img>: `data:image/jpeg;base64,${foto}`
  foto: string | null;
}
