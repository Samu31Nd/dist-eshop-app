import { tomcatApi } from "@/api/tomcatApi";
import type { Articulo } from "@/interfaces/articulo.interface";

// Partial para crear (id_articulo ausente) o actualizar
type ArticuloInput = Partial<Articulo> & { file?: File };

export const createUpdateProductAction = async (
  input: ArticuloInput,
): Promise<Articulo> => {
  const { id_articulo, file, foto, ...rest } = input;

  const isCreating = !id_articulo || id_articulo === 0;

  // Convertir el File a base64 para enviarlo en el body JSON
  // Tomcat recibe foto como byte[] — Jackson lo deserializa desde base64
  let fotoBase64: string | null = foto ?? null;

  if (file) {
    fotoBase64 = await fileToBase64(file);
  } else if (fotoBase64 && fotoBase64.startsWith("data:image")) {
    // Si la foto ya venía como DataURL del estado local, le quitamos el prefijo
    fotoBase64 = fotoBase64.split(",")[1];
  }

  // Preparamos los datos base del artículo
  const articuloPayload = {
    nombre: rest.nombre ?? "",
    descripcion: rest.descripcion ?? "",
    precio: Number(rest.precio ?? 0),
    cantidad: Number(rest.cantidad ?? 0),
    foto: fotoBase64,
  };

  if (isCreating) {
    // ──────────────────────────────────────────────────────────
    // POST: Alta de artículo
    // ──────────────────────────────────────────────────────────
    const { data } = await tomcatApi.post<{ mensaje: string }>(
      "/alta_articulo",
      articuloPayload,
    );

    if (data.mensaje !== "OK") throw new Error(data.mensaje);

    // Tomcat no regresa el artículo creado, solo { mensaje: "OK" }.
    return {
      id_articulo: 0, // desconocido hasta que se haga una consulta
      ...articuloPayload,
      foto: fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : null,
    };
  } else {
    // ──────────────────────────────────────────────────────────
    // PUT: Modificación de artículo
    // ──────────────────────────────────────────────────────────
    console.log(articuloPayload.foto);
    const { data } = await tomcatApi.put<{ mensaje: string }>(
      "/modifica_articulo",
      {
        id_articulo,
        ...articuloPayload,
      },
    );

    // Validamos el mensaje de éxito que definimos en el backend
    if (!data.mensaje.includes("exitosa") && data.mensaje !== "OK") {
      throw new Error(data.mensaje);
    }

    return {
      id_articulo,
      ...articuloPayload,
      foto: fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : null,
    };
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]); // quitar prefijo data:...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
