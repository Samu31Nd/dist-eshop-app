// Usa la Web Crypto API nativa del browser — sin dependencias externas.
// SHA-256 es determinístico: misma contraseña → mismo hash en cualquier dispositivo.
// Tomcat almacena y compara este hash, nunca la contraseña en texto plano.
export const hashPassword = async (password: string): Promise<string> => {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // hex string de 64 caracteres — coincide con VARCHAR(64) en la BD
};
