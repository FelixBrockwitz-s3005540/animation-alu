import { defineConfig } from "vite"

export default defineConfig({
    build: {
        minify: false,
        sourcemap: true,
        rolldownOptions: {
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]",
            },
        }
    },
    base: "/dist/"
});