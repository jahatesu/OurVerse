import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageJson = require.resolve("maplibre-gl/package.json");
const packageDirectory = path.dirname(packageJson);
const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(projectDirectory, "public", "maplibre");

mkdirSync(destination, { recursive: true });
for (const filename of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(path.join(packageDirectory, "dist", filename), path.join(destination, filename));
}
