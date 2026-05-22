import { tomcatApi } from "@/api/tomcatApi";
import type { Articulo } from "@/interfaces/articulo.interface";

export const getProductByIdAction = async (
  id: number | "new",
): Promise<Articulo> => {
  // Artículo vacío para el formulario de alta
  if (id === "new") {
    return {
      id_articulo: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      cantidad: 0,
      foto: null,
    };
  }

  if (!id) throw new Error("Se requiere un id de artículo");

  // Tomcat no tiene GET /articulo/:id — traemos todos y filtramos por id.
  // consulta_articulos con palabra vacía regresa todo el catálogo.
  const { data } = await tomcatApi.get<Articulo[]>("/consulta_articulos", {
    params: { palabra: "" },
  });

  const articulo = data.find((a) => a.id_articulo === Number(id));
  if (!articulo) throw new Error(`Artículo con id ${id} no encontrado`);

  return {
    ...articulo,
    foto: articulo.foto ? `data:image/jpeg;base64,${articulo.foto}` : null,
  };
};
