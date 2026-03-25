import { defineConfig } from "vite"

export default defineConfig({
    build: {
        outDir: "docs",
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
    base: "/animation-alu/"
});