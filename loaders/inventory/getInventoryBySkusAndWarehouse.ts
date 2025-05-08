import { STALE } from "apps/utils/fetch.ts";
import { logger } from "@deco/deco/o11y";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
  accountName: string;
  skuIds: string[];
  warehouseId: string;
}

/**
 * @name inventory_by_sku_and_warehouse
 * @description Get inventory information for a specific SKU in a specific warehouse
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  logger.info(`getInventoryBySkusAndWarehouse: ${JSON.stringify(props)}`);
  const { skuIds, warehouseId, accountName } = props;
  const vcs = getClient(accountName, ctx);

  if (!skuIds || skuIds.length === 0) {
    throw new Error("SKU ID is required");
  }

  if (!warehouseId) {
    throw new Error("Warehouse ID is required");
  }

  try {
    const responses = await Promise.all(
      skuIds.map((skuId) =>
        vcs
          ["GET /api/logistics/pvt/inventory/items/:skuId/warehouses/:warehouseId"](
            { skuId, warehouseId },
            { ...STALE },
          ).then((response) => response.json())
      ),
    );

    return responses;
  } catch (error) {
    console.error("Error fetching inventory by SKU and warehouse:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch inventory by SKU and warehouse");
  }
};

export default loader;
