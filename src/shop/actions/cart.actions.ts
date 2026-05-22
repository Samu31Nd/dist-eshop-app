import { tomcatApi } from "@/api/tomcatApi";

// RF-BE-3: compra_articulo - Agregar artículo al carrito
export const addToCartAction = async (
  id_articulo: number,
  cantidad: number,
): Promise<{ mensaje: string }> => {
  const { data } = await tomcatApi.put<{ mensaje: string }>(
    "/compra_articulo",
    null,
    {
      params: { id_articulo, cantidad },
    },
  );
  return data;
};

// RF-BE-4: elimina_articulo_carrito_compra - Eliminar artículo del carrito
export const removeFromCartAction = async (
  id_articulo: number,
): Promise<{ mensaje: string }> => {
  const { data } = await tomcatApi.delete<{ mensaje: string }>(
    "/elimina_articulo_carrito_compra",
    {
      params: { id_articulo },
    },
  );
  return data;
};

// RF-BE-5: elimina_carrito_compra - Vaciar todo el carrito
export const clearCartAction = async (): Promise<{ mensaje: string }> => {
  const { data } = await tomcatApi.delete<{ mensaje: string }>(
    "/elimina_carrito_compra",
  );
  return data;
};

// Consulta artículos del carrito (el backend devuelve un arreglo con los items)
// Nota: El backend original de la tarea no tiene un endpoint específico para
// consultar el carrito, así que lo simulamos con estado local.
// Si existiera /consulta_carrito, lo usaríamos aquí.
