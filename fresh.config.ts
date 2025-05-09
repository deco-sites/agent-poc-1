import { defineConfig } from "$fresh/server.ts";
import { plugins } from "deco/plugins/deco.ts";
import manifest from "./manifest.gen.ts";
import { mcpServer } from "@deco/mcp";

export default defineConfig({
  plugins: plugins({
    manifest,
    htmx: true,
    useServer: (deco, hono) => {
      hono.use(
        "/*",
        mcpServer(deco, {
          include: [
            "site/loaders/brands/brands.ts",
            "site/loaders/categories/tree.ts",
            "site/loaders/product/productBySlug.ts",
            "site/loaders/product/productByProductIds.ts",
            "site/loaders/product/productBySkuIds.ts",
            "site/loaders/product/productByTerm.ts",
            "site/loaders/call-center/aboutUs.ts",
            "site/loaders/call-center/exchangesAndReturns.ts",
            "site/loaders/call-center/frequentlyAskedQuestions.ts",
            "site/loaders/call-center/purchasesAndOrders.ts",
            "site/loaders/call-center/storeLocations.ts",
          ],
        }),
      );
    },
  }),
});
