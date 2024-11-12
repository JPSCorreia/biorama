import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/main.jsx", "resources/images/icon.svg"],
            refresh: true,
        }),
        react({ include: "**/*.jsx", fastRefresh: true }),
    ],
    server: {
        host: "localhost",
        port: 5173,
    },
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
});