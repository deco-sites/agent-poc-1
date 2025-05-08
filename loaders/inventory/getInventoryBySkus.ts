import { STALE } from "apps/utils/fetch.ts";
import { logger } from "@deco/deco/o11y";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
  skuIds: string[];
}

/**
 * @name inventory_by_sku
 * @description Get inventory information for a specific SKU across all warehouses
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  logger.info(`getInventoryBySkus: ${JSON.stringify(props)}`);
  const { skuIds, accountName } = props;
  const vcs = getClient(accountName, ctx);

  if (!skuIds || skuIds.length === 0) {
    throw new Error("SKU ID is required");
  }

  try {
    const responses = await Promise.all(
      skuIds.map((skuId) =>
        vcs["GET /api/logistics/pvt/inventory/skus/:skuId"](
          { skuId },
          { ...STALE },
        ).then((response) => response.json())
      ),
    );

    return responses;
  } catch (error) {
    console.error("Error fetching inventory by SKU:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch inventory by SKU");
  }
};

export const cache = "stale-while-revalidate";
export const cacheKey = (props: Props) =>
  `inventory_sku_${props.skuIds.join("_")}_${props.accountName}`;

export default loader;
