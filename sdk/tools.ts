import { Schemas } from "@deco/deco";
import { getTools } from "@deco/mcp";
import { createTool } from "@mastra/core/tools";
import { jsonSchemaToModel } from "@mastra/core/utils";
import { logger } from "@deco/deco/o11y";
import { z } from "npm:zod@3.24.2";
import { accounts, urls } from "site/sdk/account.ts";

export const fetchMeta = async (baseUrl: string) => {
  const response = await fetch(new URL("/live/_meta", baseUrl));
  const meta: { schema: Schemas } = await response.json();
  return meta;
};

export interface Options {
  include?: string[];
  exclude?: string[];
}
export const listMCPTools = async (
  mcpServerURL: string,
  options?: Options,
): Promise<Record<string, ReturnType<typeof createTool>>> => {
  const baseUrl = mcpServerURL;
  const meta = await fetchMeta(baseUrl);

  // deno-lint-ignore no-explicit-any
  const tools = getTools(new Map(), meta.schema, options as any);

  const createdTools: Record<string, ReturnType<typeof createTool>> = {};
  for (const tool of tools) {
    if (tool.name.includes("website") || tool.resolveType.includes("action")) {
      continue;
    }

    try {
      const createdTool = createTool({
        id: tool.name,
        description: tool.description,
        inputSchema: jsonSchemaToModel(tool.inputSchema),
        outputSchema: jsonSchemaToModel(
          tool.outputSchema ?? {
            type: "object",
            additionalProperties: true,
          },
        ),
        execute: async ({ context }) => {

          const response = await fetch(
            new URL(`/live/invoke/${tool.resolveType}`, baseUrl),
            {
              method: "POST",
              body: typeof context === "string"
                ? context
                : JSON.stringify(context),
              headers: {
                "content-type": "application/json",
              },
            },
          )
            .then((res) => res.json())
            .catch((err) => {
              console.error(err);
              return {
                error: err.message,
              };
            });
          return response;
        },
      });

      createdTools[tool.name] = createdTool;
    } catch {
      // ignore
    }
  }

  createdTools["get-buy-product-url"] = createTool({
    id: "get-buy-product-url",
    description: "Returns the URL of that send the user directly to the cart with the product added.",
    inputSchema: z.object({
      productId: z.string(),
    }),
    outputSchema: z.object({
      url: z.string().optional(),
    }),
    // deno-lint-ignore require-await
    execute: async ({ context }) => {
      const url = urls.get(context.threadId);
      if (!url) {
        return { url: undefined };
      }
      return { url: `https://www.miess.com.br/checkout/cart/add?sku=${context.productId}&qty=1&seller=1` };
    },
  });

  return createdTools;
};
