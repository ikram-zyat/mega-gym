import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En ligne (GitHub Pages), le site vit dans /mega-gym/ : changez ce nom si votre dépôt s'appelle autrement.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/mega-gym/" : "/",
  plugins: [react()],
}));
