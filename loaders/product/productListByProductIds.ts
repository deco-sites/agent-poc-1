import { STALE } from "apps/utils/fetch.ts";
import type { LegacyProduct } from "apps/vtex/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import { ProductProperties } from "site/sdk/vcs.ts";
import getClient from "site/utils/getClient.ts";

export interface Props {
  /**
   * @description Product ids to retrieve
   */
  productIds: string[];
  /**
   * @description Include similar products
   * @deprecated Use product extensions instead
   */
  similars?: boolean;
  /**
   * @title Select specific properties to return
   * @name select_properties
   * @description Select specific properties to return. Values: - all (returns all properties) - allSpecifications - allSpecificationsGroups - brand - brandId - brandImageUrl - cacheId - categories - categoriesIds - categoryId - clusterHighlights - description - items - link - linkText - metaTagDescription - origin - priceRange - productClusters - productId - productName - productReference - productTitle - properties - releaseDate - selectedProperties - skuSpecifications - specificationGroups
   */
  select: (
    | "all"
    | "allSpecifications"
    | "allSpecificationsGroups"
    | "brand"
    | "brandId"
    | "brandImageUrl"
    | "cacheId"
    | "categories"
    | "categoriesIds"
    | "categoryId"
    | "clusterHighlights"
    | "description"
    | "items"
    | "link"
    | "linkText"
    | "metaTagDescription"
    | "origin"
    | "priceRange"
    | "productClusters"
    | "productId"
    | "productName"
    | "productReference"
    | "productTitle"
    | "properties"
    | "releaseDate"
    | "selectedProperties"
    | "skuSpecifications"
    | "specificationGroups"
  )[];
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name productlist_by_product_ids
 * @description Get a list of products by product IDs
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  const vcsDeprecated = getClient(props.accountName, ctx);

  if (!props.productIds || props.productIds.length === 0) {
    throw new Error("At least one product ID is required");
  }

  const params = {
    fq: props.productIds.map((productId) => `productId:${productId}`),
    _from: 0,
    _to: Math.max(props.productIds.length - 1, 0),
  };

  const vtexProducts = await vcsDeprecated
    ["GET /api/catalog_system/pub/products/search/:term?"]({
      ...params,
    }, { ...STALE })
    .then((res) => res.json());

  if (vtexProducts && !Array.isArray(vtexProducts)) {
    throw new Error(
      `Error while fetching VTEX data ${JSON.stringify(vtexProducts)}`,
    );
  }

  const partialProducts = props.select?.length && !props.select.includes("all")
    ? vtexProducts.map((product) =>
      props.select!.reduce((acc, prop) => {
        // @ts-ignore ignore
        acc[prop] = product[prop];
        return acc;
        // deno-lint-ignore no-explicit-any
      }, {} as Record<ProductProperties, any>)
    )
    : vtexProducts;

  return partialProducts as LegacyProduct[];
};

export default loader;
