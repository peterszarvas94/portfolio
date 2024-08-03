import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "../static"),
    emptyOutDir: false, // Prevent clearing out the outDir
    lib: {
      entry: resolve(__dirname, "search.ts"),
      fileName: () => "search.js",
      formats: ["es"], // Output format
    },
    rollupOptions: {
      output: {
        entryFileNames: "search.js",
        chunkFileNames: "search.js",
      },
      plugins: [
        {
          name: "preserve-existing-files",
          generateBundle(_, bundle) {
            const outputPath = resolve(__dirname, "../static/search.js");

            // Handle OutputChunk specifically
            for (const [key, value] of Object.entries(bundle)) {
              if (value.type === "chunk" && key === "search.js") {
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
