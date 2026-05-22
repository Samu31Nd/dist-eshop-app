import { tomcatApi } from "@/api/tomcatApi";
import type { Articulo } from "@/interfaces/articulo.interface";

// Partial para crear (id_articulo ausente) — Tomcat no tiene endpoint de update de artículo
type ArticuloInput = Partial<Articulo> & { file?: File };

export const createUpdateProductAction = async (
  input: ArticuloInput,
): Promise<Articulo> => {
  const { id_articulo, file, foto, ...rest } = input;

  const isCreating = !id_articulo || id_articulo === 0;

  if (!isCreating) {
    // Tomcat no expone un endpoint de modificación de artículo en los requerimientos.
    // Si en el futuro se agrega, aquí iría el PUT correspondiente.
    throw new Error(
      "La modificación de artículos no está soportada en este backend",
    );
  }

  // Convertir el File a base64 para enviarlo en el body JSON
  // Tomcat recibe foto como byte[] — Jackson lo deserializa desde base64
  let fotoBase64: string | null = foto ?? null;
  if (file) {
    fotoBase64 = await fileToBase64(file);
  }

  const { data } = await tomcatApi.post<{ mensaje: string }>("/alta_articulo", {
    nombre: rest.nombre ?? "",
    descripcion: rest.descripcion ?? "",
    precio: Number(rest.precio ?? 0),
    cantidad: Number(rest.cantidad ?? 0),
    foto: fotoBase64,
  });

  if (data.mensaje !== "OK") throw new Error(data.mensaje);

  // Tomcat no regresa el artículo creado, solo { mensaje: "OK" }.
  // Devolvemos lo que enviamos para que la UI pueda actualizar el estado local.
  return {
    id_articulo: 0, // desconocido hasta que se haga una consulta
    nombre: rest.nombre ?? "",
    descripcion: rest.descripcion ?? "",
    precio: Number(rest.precio ?? 0),
    cantidad: Number(rest.cantidad ?? 0),
    foto: fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : null,
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]); // quitar prefijo data:...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
