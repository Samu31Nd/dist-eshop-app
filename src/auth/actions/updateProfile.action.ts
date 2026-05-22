import { tomcatApi } from "@/api/tomcatApi";
import type { MensajeResponse } from "../interfaces/auth.response";
import type { ProfileData } from "../interfaces/profile.dto";

interface UpdateProfileInput {
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  email: string;
  fecha_nacimiento: string;
  telefono?: number | null;
  genero?: string | null;
  foto?: string | null; // base64 puro
  password?: string; // vacío = no cambiar
}

export const updateProfileAction = async (
  data: UpdateProfileInput,
): Promise<ProfileData> => {
  const email = localStorage.getItem("email")!;
  const token = localStorage.getItem("token")!;

  // PUT /modifica_usuario?email=EMAIL_ORIGINAL&token=TOKEN
  // El interceptor inyecta id_usuario+token pero modifica_usuario usa email+token,
  // así que los pasamos explícitamente para sobreescribir
  await tomcatApi.put<MensajeResponse>(
    "/modifica_usuario",
    {
      email: data.email,
      nombre: data.nombre,
      apellido_paterno: data.apellido_paterno,
      apellido_materno: data.apellido_materno ?? null,
      fecha_nacimiento: data.fecha_nacimiento,
      telefono: data.telefono ?? null,
      genero: data.genero ?? null,
      foto: data.foto ?? null,
      // password vacío → Tomcat no lo actualiza
      password: data.password || null,
    },
    { params: { email, token } },
  );

  // Si el email cambió, actualizarlo en localStorage para futuras llamadas
  if (data.email !== email) {
    localStorage.setItem("email", data.email);
  }

  // Traer el perfil actualizado desde la BD
  const { data: perfil } = await tomcatApi.get<ProfileData>(
    "/consulta_usuario",
    {
      params: { email: data.email, token },
    },
  );

  return { ...perfil };
};
