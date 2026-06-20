import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import tsconfigPaths from "vite-tsconfig-paths";

const isNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    isNetlify ? netlify() : nitro({ preset: "vercel" }),
    react(),
  ],
});