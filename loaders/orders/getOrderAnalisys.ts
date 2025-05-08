import type { OrderMacroData, OrderResponse } from "site/utils/types.ts";
import { AppContext } from "site/apps/site.ts";
import getClient from "site/utils/getClient.ts";
import { formatPrice } from "site/sdk/format.ts";
import { logger } from "@deco/deco/o11y";

export interface Props {
  /**
   * @description You can retrieve orders lists filtering by an OrderField combined with an OrderType. To do so, you have to concatenate them: orderBy={{OrderField}},{{OrderType}}. OrderField values accepted: creationDate, orderId, items, totalValue and origin. OrderType values accepted: asc and desc.
   * @example v502556llux-01,asc
   */
  orderBy?: string;
  /**
   * @description Filters list to return only orders with non null values for the invoiceInput field.
   */
  f_hasInputInvoice?: boolean;
  /**
   * @description This parameter filters using Fulltext and accepts the values below. Be aware that the + caracter is not allowed in Fulltext Search. Order Id, Client email, Client document and Client name.
   * @example - OrderID: v212333lux-02 - Client email: taylor@email.com - Client document: 21133355524 - Client name: Taylor
   */
  q?: string;
  /**
   * @description You can filter orders by shipping estimate time in days by concatenating the desired number of days with the sufix .days. For example: Next 7 days: 7.days
   * @example Tomorrow: 1.days
   * @example Today: 0.days
   * @example Late: -1.days
   */
  f_shippingEstimate?: string;
  /**
   * @description You can filter orders by invoiced date by concatenating the sufix invoicedDate: with the range date in Timestamp format.
   */
  f_invoicedDate?: string;
  /**
   * @description You can filter orders by creation date by concatenating the sufix creationDate: with the range date in Timestamp format.
   */
  f_creationDate?: string;
  /**
   * @description You can filter orders by authorized date by concatenating the sufix authorizedDate: with the range date in Timestamp format.
   */
  f_authorizedDate?: string;
  /**
   * @description You can filter orders by Urchin Tracking Module (UTM) source.
   */
  f_UtmSource?: string;
  /**
   * @description You can filter orders by using a seller's name.
   */
  f_sellerNames?: string;
  /**
   * @description You can filter orders by using a Call Center Operator's identification.
   */
  f_callCenterOperatorName?: string;
  /**
   * @description You can filter orders by sales channel's (or trade policy) name.
   */
  f_salesChannel?: string;
  /**
   * @description You can filter orders by sales channel's (or trade policy) ID.
   */
  salesChannelId?: string;
  /**
   * @description You can filter orders by affiliate ID.
   */
  f_affiliateId?: string;
  /**
   * @description You can filter orders by the following order status.
   */
  f_status?:
    | "waiting-for-sellers-confirmation"
    | "payment-pending"
    | "payment-approved"
    | "ready-for-handling"
    | "handling"
    | "invoiced"
    | "canceled";
  /**
   * @description When set as true, you retrieve incomplete orders, when set as false, you retrieve orders that are not incomplete.
   */
  incompleteOrders?: boolean;
  /**
   * @description You can filter orders by payment type.
   */
  f_paymentNames?: string;
  /**
   * @description You can filter orders by rates and benefits (promotions).
   */
  f_RnB?: string;
  /**
   * @description You can search orders by using one of the following criterias.
   */
  searchField?: string;
  /**
   * @description When set as true, this parameter filters orders made via inStore, and when set as false, it filters orders that were not made via inStore.
   */
  f_isInstore?: boolean;
  /**
   * @description The account name
   */
  accountName: string;
  /**
   * @title Order products by
   * @description You can order products by quantity or price.
   * @default quantity-desc
   */
  ordersItemsBy:
    | "quantity-asc"
    | "quantity-desc"
    | "final-value-asc"
    | "final-value-desc";
  /**
   * @title Limit returned orders
   * @description The number of orders to return. ONLY AFFECTS THE RETURNED ORDERS, NOT THE ORDERS USED TO CALCULATE THE MACRO DATA.
   * @default 10
   */
  limitReturnedOrders?: number;
  /**
   * @title Limit returned order items
   * @description The number of order items to return. ONLY AFFECTS THE RETURNED ORDER ITEMS, NOT THE ORDER ITEMS USED TO CALCULATE THE MACRO DATA.
   * @default 10
   */
  limitReturnedOrderItems?: number;
}

/**
 * @name get_orders_analisys
 * @description Get order(s) main data to analisys, including order items
 */
export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<OrderMacroData> {
  logger.info(`tool:get_orders_analisys, ${JSON.stringify(props)}`);
  const { accountName, ...filters } = props;
  const vcs = getClient(accountName, ctx);

  // Get all orders with pagination
  let allOrders: OrderResponse["list"] = [];
  const orderItemsBy = props.ordersItemsBy ?? "quantity-desc";
  const limitReturnedOrders = props.limitReturnedOrders ?? 10;
  const limitReturnedOrderItems = props.limitReturnedOrderItems ?? 10;
  let currentPage = 1;
  const perPage = 100; // Maximum allowed per page
  let hasMorePages = true;

  while (hasMorePages) {
    const ordersResponse = await vcs["GET /api/oms/pvt/orders"]({
      ...filters,
      page: currentPage,
      per_page: perPage,
    }).then((res) => res.json());

    const { list, paging } = ordersResponse;
    allOrders = [...allOrders, ...list];

    if (currentPage >= paging.pages || currentPage >= 30) { // VTEX limit of 30 pages
      hasMorePages = false;
    } else {
      currentPage++;
    }
  }

  // Get order IDs
  const orderIds = allOrders.map((order) => order.orderId);

  // Get order items
  const orderItemsPromises = orderIds.map(async (orderId) => {
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

  const orderItemsResponse = await Promise.all(orderItemsPromises);

  // Calculate total value and orders count
  const periodTotalValue = allOrders.reduce(
    (sum, order) => sum + order.totalValue,
    0,
  );
  const periodTotalOrders = allOrders.length;

  // Format orders data
  const orders = allOrders.map((order) => ({
    orderId: order.orderId,
    creationDate: order.creationDate,
    clientName: order.clientName,
    totalValue: order.totalValue,
    status: order.status,
    formattedTotalValue: formatPrice(order.totalValue),
  }));

  // Format order items data and group by productId
  const ordersItemsMap = new Map<string, {
    productId: string;
    productName: string;
    productQuantity: number;
    productTotalValue: number;
    formattedProductTotalValue: string | null;
  }>();

  orderItemsResponse.flatMap((order) => order.items).forEach((item) => {
    const existingItem = ordersItemsMap.get(item.productId);
    if (existingItem) {
      const productTotalValue = existingItem.productTotalValue +
        (item.price * item.quantity);
      existingItem.productQuantity += item.quantity;
      existingItem.productTotalValue = productTotalValue;
      existingItem.formattedProductTotalValue = formatPrice(
        productTotalValue,
      );
    } else {
      ordersItemsMap.set(item.productId, {
        productId: item.productId,
        productName: item.name,
        productQuantity: item.quantity,
        productTotalValue: item.price * item.quantity,
        formattedProductTotalValue: formatPrice(
          item.price * item.quantity,
        ),
      });
    }
  });

  // Convert map to array and sort
  const ordersItems = Array.from(ordersItemsMap.values()).sort((a, b) => {
    switch (orderItemsBy) {
      case "quantity-asc":
        return a.productQuantity - b.productQuantity;
      case "quantity-desc":
        return b.productQuantity - a.productQuantity;
      case "final-value-asc":
        return a.productTotalValue - b.productTotalValue;
      case "final-value-desc":
        return b.productTotalValue - a.productTotalValue;
      default:
        return 0;
    }
  });

  return {
    orders: orders.slice(0, limitReturnedOrders),
    ordersItems: ordersItems.slice(0, limitReturnedOrderItems),
    periodTotalOrders,
    periodTotalValue,
    formattedPeriodTotalValue: formatPrice(periodTotalValue),
  };
}
