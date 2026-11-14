import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        allowedHosts: ['0.0.0.0', 'capital-declared-postcard.ngrok-free.dev'],
        proxy: {
            "/api": "http://backend:8000",
            "/private-media": "http://backend:8000",
        },
    },
});
