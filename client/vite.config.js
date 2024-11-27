import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable hosting on 0.0.0.0 for access outside the container
    port: 5173, // Ensure the port matches Docker's exposed port
    watch: {
      usePolling: true, // Use polling to handle file watching inside Docker
    },
  },
});

