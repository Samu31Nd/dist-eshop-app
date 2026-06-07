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
  // base: "http://localhost:7071/api/ServidorWeb?nombre=", // <-- ESTA LÍNEA ES CRUCIAL
  server: {
    proxy: {
      "/api": {
        target:
          "http://t8ap2022630250-enh4ccgtb8dnd3bn.eastus-01.azurewebsites.net", // puerto del emulador de Azure Functions
        changeOrigin: true,
      },
    },
  },
});
