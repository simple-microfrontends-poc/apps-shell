import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const stub = (file: string) =>
  fileURLToPath(new URL(`./src/test/stubs/${file}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // The remotes are Module Federation modules, unavailable under test.
      // Point each at its own local stub so React.lazy() can resolve them and
      // routing tests can tell which remote rendered.
      "products/App": stub("productsStub.tsx"),
      "categories/App": stub("categoriesStub.tsx"),
      "productPage/App": stub("productPageStub.tsx"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
