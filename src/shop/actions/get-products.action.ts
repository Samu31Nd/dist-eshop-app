import { tomcatApi } from "@/api/tomcatApi";
import type { Articulo } from "@/interfaces/articulo.interface";

interface Options {
  query?: string; // palabra clave — busca en nombre y descripcion con LIKE
}

export const getProductsAction = async (
  options: Options,
): Promise<Articulo[]> => {
  const { query = "" } = options;

  // consulta_articulos es GET con ?palabra=&id_usuario=&token=
  // id_usuario y token los inyecta el interceptor de tomcatApi automáticamente
  const { data } = await tomcatApi.get<Articulo[]>("/consulta_articulos", {
    params: { palabra: query },
  });

  // La foto viene como base64 desde Tomcat (Jackson serializa byte[] así).
  // Agregamos el prefijo data URI para poder usarla directo en un <img src=...>
  return data.map((articulo) => ({
    ...articulo,
    foto: articulo.foto ? `data:image/jpeg;base64,${articulo.foto}` : null,
  }));
};
