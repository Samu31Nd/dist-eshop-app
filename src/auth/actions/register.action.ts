import { tomcatApi } from "@/api/tomcatApi";
import type { MensajeResponse } from "../interfaces/auth.response";
import type { ProfileData } from "../interfaces/profile.dto";
import { hashPassword } from "@/lib/hash-password";

export const registerAction = async (
  profile: ProfileData,
  password: string,
): Promise<MensajeResponse> => {
  // alta_usuario es POST y recibe el body JSON directamente, sin token.
  // Los campos deben coincidir exactamente con los atributos de Usuario.java.

  const hashed = await hashPassword(password);

  const { data } = await tomcatApi.post<MensajeResponse>("/alta_usuario", {
    email: profile.email,
    password: hashed,
    nombre: profile.nombre,
    apellido_paterno: profile.apellido_paterno,
    apellido_materno: profile.apellido_materno ?? null,
    fecha_nacimiento: profile.fecha_nacimiento, // "1995-06-15T00:00:00.000"
    telefono: profile.telefono ?? null,
    genero: profile.genero ?? null,
    foto: profile.foto ?? null,
  });

  // Tomcat regresa { mensaje: "Se dio de alta el usuario" } si todo salió bien,
  // o lanza un 400 con { mensaje: "el email ya existe" } que axios convierte en error.
  return data;
};
