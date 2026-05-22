import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/Servicio": {
        target: "https://nahumvg8escom.ddns.net",
        changeOrigin: true, // Obligatorio para evitar problemas de host
        secure: false, // Opcional, pero ayuda si hay problemas con la validación del certificado localmente
      },
    },
  },
});
