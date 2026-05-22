import type { ProfileData } from "./profile.dto";

// Lo que regresa loginAction (combinación de /login + /consulta_usuario)
export interface AuthResponse {
  id_usuario: number;
  token: string;
  user: ProfileData;
}

// Lo que regresa alta_usuario, alta_articulo, compra_articulo, etc.
export interface MensajeResponse {
  mensaje: string;
}
