import axios from "axios";

const tomcatApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

tomcatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const id_usuario = localStorage.getItem("id_usuario");

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
