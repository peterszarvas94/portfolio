import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "../static"),
    emptyOutDir: false, // Prevent clearing out the outDir
    lib: {
      entry: resolve(__dirname, "home.ts"),
      fileName: () => "home.js",
      formats: ["es"], // Output format
    },
    rollupOptions: {
      output: {
        entryFileNames: "home.js",
        chunkFileNames: "home.js",
      },
      plugins: [
        {
          name: "preserve-existing-files",
          generateBundle(_, bundle) {
            const outputPath = resolve(__dirname, "../static/home.js");

            // Handle OutputChunk specifically
            for (const [key, value] of Object.entries(bundle)) {
              if (value.type === "chunk" && key === "home.js") {
                // Ensure the directory exists
                mkdirSync(dirname(outputPath), { recursive: true });
                // Write the code to the output file
                writeFileSync(outputPath, value.code);
              }
            }
          },
        },
      ],
    },
  },
});
