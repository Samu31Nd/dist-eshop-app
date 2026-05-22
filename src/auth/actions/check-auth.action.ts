import { tomcatApi } from "@/api/tomcatApi";
import type { AuthResponse } from "../interfaces/auth.response";
import type { ProfileData } from "../interfaces/profile.dto";

export const checkAuthAction = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");
  const email = localStorage.getItem("email");

  if (!token || !id_usuario || !email)
    throw new Error("No hay sesión guardada");

  // Validar contra la BD y recuperar perfil actualizado en una sola llamada
  const { data: perfil } = await tomcatApi.get<ProfileData>(
    "/consulta_usuario",
    {
      params: { email, token },
    },
  );

  const user: ProfileData = { ...perfil };

  return {
    id_usuario: Number(id_usuario),
    token,
    user,
  };
};
