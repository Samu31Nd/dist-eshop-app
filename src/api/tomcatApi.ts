import axios from "axios";

// Vite proxy ya redirige /Servicio → http://localhost:8080
// así que en producción solo cambia VITE_API_URL
const tomcatApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/Servicio/rest/ws",
});

// Interceptor: inyecta id_usuario + token en cada request que los necesite.
// Los guardamos en localStorage después del login.
tomcatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");

  // Los endpoints protegidos reciben id_usuario y token como query params,
  // no como header Authorization → los pegamos a la URL automáticamente.
  if (token && id_usuario) {
    config.params = {
      ...config.params,
      id_usuario,
      token,
    };
  }

  return config;
});

export { tomcatApi };
