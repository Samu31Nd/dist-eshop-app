import { tomcatApi } from "@/api/tomcatApi";
import type { MensajeResponse } from "../interfaces/auth.response";

export const deleteUserAction = async (): Promise<MensajeResponse> => {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");
  const email = localStorage.getItem("email");
  if (!token || !email) throw new Error("No hay sesión guardada");

  const { data } = await tomcatApi.delete<MensajeResponse>("/borra_usuario", {
    params: { id_usuario, token },
  });

  localStorage.removeItem("token");
  localStorage.removeItem("id_usuario");
  localStorage.removeItem("email");

  return data;
};
