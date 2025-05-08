import { logger } from "@deco/deco/o11y";
import type { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";

interface Props {
    
  /**
   * @description The order id
   */
  orderId: string;
  /**
   * @description The account name
   */
  accountName: string;
}

/**
 * @name get_order_by_id
 * @description Get order by id
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  logger.info(`tool:get_order_by_id, ${JSON.stringify(props)}`);
  const vcs = getClient(props.accountName, ctx);

  const order = await vcs["GET /api/oms/pvt/orders/:orderId"](props)
    .then((res) => res.json());

  return order;
}
