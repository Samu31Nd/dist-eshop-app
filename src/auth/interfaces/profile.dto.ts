export interface ProfileData {
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento: string; // "YYYY-MM-DDTHH:mm:ss.SSS"
  telefono?: number;
  genero?: string; // "M" | "F"
  foto?: string; // base64 puro, sin prefijo data URI
}
