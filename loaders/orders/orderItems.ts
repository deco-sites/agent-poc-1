import getClient from "site/utils/getClient.ts";
import { AppContext } from "site/apps/site.ts";
import { OrderItemsList } from "site/utils/types.ts";
import { logger } from "@deco/deco/o11y";

export interface Props {
  orderIds: string[];
  accountName: string;
}

/**
 * @name order_items
 * @description Get the items of several orders
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<OrderItemsList[]> {
  logger.info(`tool:order_items, ${JSON.stringify(props)}`);
  const vcs = getClient(props.accountName, ctx);

  const orderPromises = props.orderIds.map(async (orderId) => {
    const response = await vcs["GET /api/oms/pvt/orders/:orderId"](
      {
        orderId,
      },
      {},
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get order ${orderId}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  });

  const orders = await Promise.all(orderPromises);

  return orders.map((order) => {
    return {
      orderId: order.orderId,
      items: order.items,
    };
  });
}
