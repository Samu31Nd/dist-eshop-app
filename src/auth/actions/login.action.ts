import { tomcatApi } from "@/api/tomcatApi";
import type { AuthResponse } from "../interfaces/auth.response";
import type { ProfileData } from "../interfaces/profile.dto";
import { hashPassword } from "@/lib/hash-password";

export const loginAction = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const hashed = await hashPassword(password);
  // 1. Autenticar — regresa { id_usuario, token }
  const { data: auth } = await tomcatApi.get<{
    id_usuario: number;
    token: string;
  }>("/login", {
    params: { email, password: hashed },
  });

  // 2. Recuperar perfil completo del usuario
  // consulta_usuario usa email+token (no id_usuario+token), los pasamos directo
  const { data: perfil } = await tomcatApi.get<ProfileData>(
    "/consulta_usuario",
    {
      params: { email, token: auth.token },
    },
  );

  const user: ProfileData = { ...perfil };

  return {
    id_usuario: auth.id_usuario,
    token: auth.token,
    user,
  };
};

export const logoutAction = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id_usuario");
  localStorage.removeItem("email");
};
