import {
    ClientPreferencesData,
    DeliveryId,
    ItemMetadata,
    PaymentData,
    PickupStoreInfo,
    RatesAndBenefitsData,
    Seller,
    ShippingData,
    Sla,
    StorePreferencesData,
  } from "apps/vtex/utils/types.ts";
  
  export interface Userorderdetails {
    /**
     * Order ID is a unique code that identifies an order.
     */
    orderId: string;
    /**
     * Sequence is a six-digit string that follows the order ID. For example, in order `1268540501456-01 (501456)`, the sequence is `501456`.
     */
    sequence: string;
    /**
     * Marketplace order ID.
     */
    marketplaceOrderId: string;
    /**
     * Marketplace services endpoint.
     */
    marketplaceServicesEndpoint: string;
    /**
     * ID of the seller related to the order. It can be a VTEX seller or an external seller.
     */
    sellerOrderId: string;
    /**
     * Order's [origin in the order flow](https://developers.vtex.com/docs/guides/orders-overview#understanding-order-flow-types), which can be `Marketplace`, `Fulfillment` or `Chain`.
     */
    origin: string;
    /**
     * Corresponds to the three-digit [affiliate](https://help.vtex.com/en/tutorial/configuring-affiliates--tutorials_187) identification code of the seller responsible for the order.
     */
    affiliateId: string;
    /**
     * Sales channel (or [trade policy](https://help.vtex.com/tutorial/how-trade-policies-work--6Xef8PZiFm40kg2STrMkMV)) ID related to the order.
     */
    salesChannel: string;
    /**
     * Name of the merchant.
     */
    merchantName: string;
    /**
     * Order [status](https://help.vtex.com/en/tutorial/order-flow-and-status--tutorials_196).
     */
    status: string;
    /**
     * Indicates if the order workflow is in an error state.
     */
    workflowIsInError: boolean;
    /**
     * @deprecated
     * `Deprecated`. Status description which is displayed on the Admin panel. This field is obsolete and may not return any value.
     */
    statusDescription: string;
    /**
     * Order's total amount.
     */
    value: number;
    /**
     * Order's creation date.
     */
    creationDate: string;
    /**
     * Order's last change date.
     */
    lastChange: string;
    /**
     * Order's group ID.
     */
    orderGroup: string;
    /**
     * List with details about orders' totals.
     */
    totals: Total[];
    /**
     * Information about order's items.
     */
    items: OrderItem[];
    /**
     * Marketplace details object.
     */
    marketplaceItems: string[];
    clientProfileData: ClientProfileData;
    /**
     * Information about gift list, when it applies.
     */
    giftRegistryData: string;
    /**
     * Information about promotions and marketing. For example, coupon tracking information and internal or external UTMs.
     */
    marketingData: {
      /**
       * Object ID. The expected value is `marketingData`.
       */
      id?: string;
      /**
       * Value of the `utm_source` parameter of the URL that led to the request.
       */
      utmSource?: string;
      /**
       * UTM Source Parameters.
       */
      utmPartner?: string;
      /**
       * Value of the `utm_medium` parameter of the URL that led to the request.
       */
      utmMedium?: string;
      /**
       * Value of the `utm_campaign` parameter of the URL that led to the request.
       */
      utmCampaign?: string;
      /**
       * Coupon code.
       */
      coupon?: string;
      /**
       * Internal UTM value `utmi_cp`.
       */
      utmiCampaign?: string;
      /**
       * Internal UTM value `utmi_p`.
       */
      utmipage?: string;
      /**
       * Internal UTM value `utmi_pc`.
       */
      utmiPart?: string;
      /**
       * Marketing tags information. This field can be used to register campaign data or informative tags regarding promotions.
       */
      marketingTags?: string[];
    };
    ratesAndBenefitsData: RatesAndBenefitsData;
    shippingData: ShippingData;
    paymentData: PaymentData;
    packageAttachment: PackageAttachment;
    /**
     * List of all sellers associated with the order.
     */
    sellers: Seller[];
    /**
     * Call center operator responsible for the order.
     */
    callCenterOperatorData: string;
    /**
     * Email of the store's employee responsible for managing the order.
     */
    followUpEmail: string;
    /**
     * Last sent transactional message.
     */
    lastMessage: string;
    /**
     * Account Hostname registered in License Manager.
     */
    hostname: string;
  
    changesAttachment: ChangesAttachment;
    /**
       * Optional field with order's additional information. This field must be filled in using the following format:
       *
      ```
       *
      {
       *     "fieldExample": "ValueExample"
       *   }
       *
      ```
       *
      .
       */
    openTextField: string;
    /**
     * Rounding error total amount, if it applies. For example, in orders with a discount over non-integer multiplier items, the rounding price is performed per item, not after the sum of all items. That can cause a difference in the total discount amount, which is informed in this field.
     */
    roundingError: number;
    /**
     * [Order form](https://developers.vtex.com/docs/guides/orderform-fields) ID.
     */
    orderFormId: string;
    /**
     * Information about commercial conditions.
     */
    commercialConditionData: string;
    /**
     * When set as `true`, the order's payment has been settled, and when set as `false`, it has not been settled yet.
     */
    isCompleted: boolean;
    /**
     * Custom information in the order. This field is useful for storing data not included in other fields, for example, a message for a gift or a name to be printed in a shirt.
     */
    customData: string;
    storePreferencesData: StorePreferencesData;
    /**
     * When set as `true`, the order can be canceled, and when set as `false`, it is no longer possible to cancel the order.
     */
    allowCancellation: boolean;
    /**
     * When set as `true`, the order can be edited, and when set as `false`, it is no longer possible to edit the order.
     */
    allowEdition: boolean;
    /**
     * This field is set `true` when the order was made via inStore and `false` when it was not.
     */
    isCheckedIn: boolean;
    marketplace: Marketplace;
    /**
     * Authorized order date.
     */
    authorizedDate: string;
    /**
     * Order's invoice date.
     */
    invoicedDate: string;
    /**
     * Reason for order cancellation.
     */
    cancelReason: string;
    itemMetadata: ItemMetadata;
    subscriptionData: SubscriptionData;
    taxData: TaxData;
    /**
     * If the field `isCheckedIn` is set as `true`, the `checkedInPickupPointId` will retrieve the ID of the physical store where the order was made.
     */
    checkedInPickupPointId: string;
    cancellationData: CancellationData;
    clientPreferencesData: ClientPreferencesData;
    /**
     * Details of cancellation requests made for the order.
     */
    cancellationRequests: {
      /**
       * ID of the cancellation request.
       */
      id?: string;
      /**
       * Reason for the cancellation request.
       */
      reason?: string;
      /**
       * Date when the cancellation was requested.
       */
      cancellationRequestDate?: string;
      /**
       * Indicates if the request was made by the user.
       */
      requestedByUser?: boolean;
      /**
       * Indicates if the cancellation request was denied by the seller.
       */
      deniedBySeller?: boolean;
      /**
       * Reason for denial by the seller.
       */
      deniedBySellerReason?: string;
      /**
       * Date when the cancellation request was denied.
       */
      cancellationRequestDenyDate?: string;
    }[];
    minItems?: 0;
  }
  
  /**
   * Object about order's totals.
   */
  export interface Total {
    /**
     * Code that identifies if the information is about `Items`, `Discounts`, `Shipping`, `Tax` or `Change`.
     */
    id: string;
    /**
     * Name of `Items`, `Discounts`, `Shipping`, `Tax` or `Change`.
     */
    name: string;
    /**
     * Total amount of `Items`, `Discounts`, `Shipping`, `Tax` or `Change`.
     */
    value: number;
  }
  /**
   * Information about an individual item in the order.
   */
  export interface OrderItem {
    /**
     * Unique identifier for the item in the order.
     */
    uniqueId: string;
    /**
     * SKU identifier of the item.
     */
    id: string;
    /**
     * Product ID associated with the item.
     */
    productId: string;
    /**
     * European Article Number (EAN) for the item, if applicable.
     */
    ean: string;
    /**
     * Identifier to lock the item in the order.
     */
    lockId: string;
    /**
     * Attachment details associated with the item.
     */
    itemAttachment: {
      /**
       * Name of the attachment, if applicable.
       */
      name?: string;
    };
    /**
     * Quantity of the item in the order.
     */
    quantity: number;
    /**
     * Identifier of the seller providing the item.
     */
    seller: string;
    /**
     * Name of the item as displayed to the customer.
     */
    name: string;
    /**
     * Reference ID for the item.
     */
    refId: string;
    /**
     * Price of the item.
     */
    price: number;
    /**
     * List price of the item.
     */
    listPrice: number;
    /**
     * Manually defined price for the item, if applicable.
     */
    manualPrice: number;
    /**
     * URL of the item's image.
     */
    imageUrl: string;
    /**
     * URL for more details about the item.
     */
    detailUrl: string;
    /**
     * Offerings attached to the item.
     */
    attachmentOfferings: {
      name?: string;
      required?: boolean;
    }[];
    /**
     * SKU identifier as defined by the seller.
     */
    sellerSku: string;
    /**
     * Date until the price is valid.
     */
    priceValidUntil: string;
    /**
     * Commission on the item, if applicable.
     */
    commission: number;
    /**
     * Tax applied to the item.
     */
    tax: number;
    /**
     * Date when the item will be available for sale.
     */
    preSaleDate: string;
    /**
     * Additional information about the item.
     */
    additionalInfo: {
      /**
       * Name of the brand associated with the item.
       */
      brandName?: string;
      /**
       * ID of the brand associated with the item.
       */
      brandId?: string;
      /**
       * String of category IDs associated with the item.
       */
      categoriesIds?: string;
      /**
       * Product cluster ID for the item.
       */
      productClusterId?: string;
      /**
       * ID of the commercial condition associated with the item.
       */
      commercialConditionId?: string;
      /**
       * Dimensions of the item.
       */
      dimension?: {
        /**
         * Cubic weight of the item.
         */
        cubicweight?: number;
        /**
         * Height of the item.
         */
        height?: number;
        /**
         * Length of the item.
         */
        length?: number;
        /**
         * Weight of the item.
         */
        weight?: number;
        /**
         * Width of the item.
         */
        width?: number;
      };
      /**
       * List of categories associated with the item.
       */
      categories?: {
        /**
         * ID of the category.
         */
        id: number;
        /**
         * Name of the category.
         */
        name: string;
      }[];
    };
    /**
     * Unit of measurement for the item.
     */
    measurementUnit: string;
    /**
     * Multiplier for the measurement unit.
     */
    unitMultiplier: number;
    /**
     * Final selling price of the item.
     */
    sellingPrice: number;
    /**
     * Indicates if the item is a gift.
     */
    isGift: boolean;
    /**
     * Shipping cost for the item, if applicable.
     */
    shippingPrice: number;
    /**
     * Reward value associated with the item.
     */
    rewardValue: number;
    /**
     * Freight commission on the item.
     */
    freightCommission: number;
    /**
     * Detailed information about the item's price structure.
     */
    priceDefinitions: {
      sellingPrices?: {
        value?: number;
        quantity?: number;
      }[];
      calculatedSellingPrice?: number;
      total?: number;
    };
    /**
     * Tax code associated with the item.
     */
    taxCode: string;
    /**
     * Index of the parent item, if this item is part of a bundle.
     */
    parentItemIndex: number;
    /**
     * Assembly binding of the parent item, if applicable.
     */
    parentAssemblyBinding: string;
    /**
     * ID of the call center operator handling the item.
     */
    callCenterOperator: string;
    /**
     * Serial numbers associated with the item.
     */
    serialNumbers: string;
    /**
     * Cost price of the item.
     */
    costPrice: number;
  }
  /**
   * Object with information on the client's profile.
   */
  export interface ClientProfileData {
    /**
     * Object ID, the expected value is `clientProfileData`.
     */
    id: string;
    /**
     * Customer's email.
     */
    email: string;
    /**
     * Customer's first name.
     */
    firstName: string;
    /**
     * Customer's last name.
     */
    lastName: string;
    /**
     * Type of the document informed by the customer.
     */
    documentType: string;
    /**
     * Document identification code informed by the customer.
     */
    document: string;
    /**
     * Customers's phone number.
     */
    phone: string;
    /**
     * If the customer is a legal entity, here goes the corporate name.
     */
    corporateName: string;
    /**
     * If the customer is a legal entity, here goes the trade name.
     */
    tradeName: string;
    /**
     * If the customer is a legal entity, here goes the corporate document.
     */
    corporateDocument: string;
    /**
     * If the customer is a legal entity, here goes the state inscription.
     */
    stateInscription: string;
    /**
     * If the customer is a legal entity, here goes the corpany's phone number.
     */
    corporatePhone: string;
    /**
     * The value is `true` when the customer is a legal entity and `false` when not.
     */
    isCorporate: boolean;
    /**
     * Customer user profile ID.
     */
    userProfileId: string;
    /**
     * Identification of the class the customer belongs to.
     */
    customerClass: string;
  }
  /**
   * Shipping address details.
   */
  export interface Address {
    /**
     * Type of address. For example, `Residential` or `Pickup`, among others.
     */
    addressType: string;
    /**
     * Name of the person who is going to receive the order.
     */
    receiverName: string;
    /**
     * Shipping address ID.
     */
    addressId: string;
    /**
     * Shipping address version ID.
     */
    versionId: string;
    /**
     * Shipping address entity ID.
     */
    entityId: string;
    /**
     * Postal code of the shipping address.
     */
    postalCode: string;
    /**
     * City of the shipping address.
     */
    city: string;
    /**
     * State of the shipping address.
     */
    state: string;
    /**
     * Three letters ISO code of the country of the shipping address (ISO 3166 ALPHA-3).
     */
    country: string;
    /**
     * Street of the shipping address.
     */
    street: string;
    /**
     * Number of the building, house or apartment in the shipping address.
     */
    number: string;
    /**
     * Neighborhood of the shipping address.
     */
    neighborhood: string;
    /**
     * Complement to the shipping address when it applies.
     */
    complement: string;
    /**
     * Complement to help locate the shipping address, in case of delivery.
     */
    reference: string;
    /**
     * Array with two numbers with geocoordinates, first longitude then latitude.
     */
    geoCoordinates: number[];
  }
  export interface LogisticsInfo {
    /**
     * Index of the item starting from 0.
     */
    itemIndex: number;
    /**
     * Selected shipping option.
     */
    selectedSla: string;
    /**
     * Logistics [reservation](https://help.vtex.com/en/tutorial/how-does-reservation-work--tutorials_92) waiting time.
     */
    lockTTL: string;
    /**
     * Shipping price for the item in cents. Does not account for the whole order's shipping price.
     */
    price: number;
    /**
     * SKU's optional price for a specific trade policy.
     */
    listPrice: number;
    /**
     * Item's selling price.
     */
    sellingPrice: number;
    /**
     * [Scheduled delivery](https://help.vtex.com/tutorial/scheduled-delivery--22g3HAVCGLFiU7xugShOBi) window information, if it applies to the item.
     */
    deliveryWindow: string;
    /**
     * [Carrier](https://help.vtex.com/en/tutorial/transportadoras-na-vtex--7u9duMD5UQa2QQwukAWMcE) company's name.
     */
    deliveryCompany: string;
    /**
     * Total shipping estimate time in days. For instance, three business days is represented `3bd`.
     */
    shippingEstimate: string;
    /**
     * Shipping estimate date. It is defined only after the confirmation of the order.
     */
    shippingEstimateDate: string;
    /**
     * Information on Service Level Agreement (SLA), corresponding to [shipping policies](https://help.vtex.com/tutorial/shipping-policy--tutorials_140).
     */
    slas: Sla[];
    /**
     * Three letters ISO code of the country of the shipping address (ISO 3166 ALPHA-3).
     */
    shipsTo: string[];
    /**
     * Information about delivery IDs.
     */
    deliveryIds: DeliveryId[];
    /**
     * List of delivery channels associated with the trade policy.
     */
    deliveryChannels: {
      /**
       * Delivery channel's shipping type, which can be `delivery` or `pickup-in-point`.
       */
      id: string;
      /**
       * Stock check for an SKU availability.
       */
      stockBalance: number;
    }[];
    /**
     * If the delivery channel is `delivery` or `pickup-in-point`.
     */
    deliveryChannel: string;
    pickupStoreInfo: PickupStoreInfo;
    /**
     * Address ID.
     */
    addressId: string;
    /**
     * Shipping address version ID.
     */
    versionId: string;
    /**
     * Shipping address entity ID.
     */
    entityId: string;
    /**
     * Name of the [polygon](https://help.vtex.com/en/tutorial/registering-geolocation/) associated with the shipping policy.
     */
    polygonName: string;
    /**
     * [Pickup point](https://help.vtex.com/en/tutorial/pickup-points--2fljn6wLjn8M4lJHA6HP3R)'s ID.
     */
    pickupPointId: string;
    /**
     * Duration in business days of the time the carrier takes in transit to fulfill the order. For example, three business days is represented `3bd`.
     */
    transitTime: string;
  }
  
  /**
   * Package object populated after order invoiced.
   */
  export interface PackageAttachment {
    /**
     * Details of each package in the order.
     */
    packages: Package[];
  }
  
  /**
   * Details of an individual package in the order.
   */
  export interface Package {
    /**
     * Fiscal operation code for the package.
     */
    cfop: string;
    /**
     * Invoice number associated with the package.
     */
    invoiceNumber: string;
    /**
     * Total value of the invoice.
     */
    invoiceValue: number;
    /**
     * URL for the invoice, if available.
     */
    invoiceUrl: string;
    /**
     * Date when the invoice was issued.
     */
    issuanceDate: string;
    /**
     * Tracking number for the package, if available.
     */
    trackingNumber: string;
    /**
     * Unique key for the invoice.
     */
    invoiceKey: string;
    /**
     * URL for tracking the package, if available.
     */
    trackingUrl: string;
    /**
     * Embedded invoice data.
     */
    embeddedInvoice: string;
    /**
     * Current status of the courier handling the package.
     */
    courierStatus: {
      /**
       * Status of the courier, if available.
       */
      status: string;
      /**
       * Indicates if the delivery process is finished.
       */
      finished: boolean;
      /**
       * Date the package was delivered, if applicable.
       */
      deliveredDate: string;
    };
    /**
     * Type of package, either 'Input' or 'Output'.
     */
    type: "Input" | "Output";
  }
  
  /**
   * Information about changes in the order.
   */
  export interface ChangesAttachment {
    /**
     * Object ID, the expect value is `changeAttachment`.
     */
    id: string;
    /**
     * Order change details.
     */
    changesData: ChangesDatum[];
  }
  
  export interface ChangesDatum {
    /**
     * Text explaining why there was a change in the order. This information may be shown to the customer in the UI or transactional emails.
     */
    reason: string;
    /**
     * Order change discount value.
     */
    discountValue: number;
    /**
     * Order change increment value.
     */
    incrementValue: number;
    /**
     * List of items added to the order.
     */
    itemsAdded: string[];
    /**
     * List of items removed from the order.
     */
    itemsRemoved: ItemsRemoved[];
    receipt: Receipt;
  }
  
  export interface ItemsRemoved {
    /**
     * SKU ID of the item removed from the order.
     */
    id: string;
    /**
     * Name of the item removed from the order.
     */
    name: string;
    /**
     * Quantity of items removed from the order.
     */
    quantity: number;
    /**
     * Total amount of items removed from the order.
     */
    price: number;
    /**
     * Unit multiplier of the item removed from the order.
     */
    unitMultiplier: string;
  }
  /**
   * Information about the receipt for changed orders.
   */
  export interface Receipt {
    /**
     * Date when the receipt was created.
     */
    date: string;
    /**
     * ID of the order.
     */
    orderId: string;
    /**
     * Receipt's unique identifier code.
     */
    receipt: string;
  }
  
  /**
   * Details about the marketplace related to the order.
   */
  export interface Marketplace {
    /**
     * Marketplace base URL.
     */
    baseURL: string;
    /**
     * If is a certified marketplace.
     */
    isCertified: string;
    /**
     * Name of the marketplace.
     */
    name: string;
  }
  
  /**
   * Information about subscriptions.
   */
  export interface SubscriptionData {
    /**
     * ID of the subscription's group. If this field returns `null` and the `executionCount` is `0`, the order is the first one with subscriptions.
     */
    SubscriptionGroupId: string;
    /**
     * List with subscriptions and their details.
     */
    Subscriptions: {
      /**
       * Position of the order in the subscription cycle.
       */
      ExecutionCount: number;
      /**
       * Price of the order at the subscription start date.
       */
      PriceAtSubscriptionDate: number;
      /**
       * Each item in the subscriptions' order is identified by an index.
       */
      ItemIndex: number;
      /**
       * Information about the subscription's validity and frequency.
       */
      Plan: {
        /**
         * Type of plan.
         */
        type: string;
        /**
         * Information about subscriptions' recurrence.
         */
        frequency: {
          /**
           * Defines the subscriptions recurrence period.
           */
          periodicity: string;
          /**
           * Interval between subscription orders, depending on the periodicity.
           */
          interval: number;
        };
        /**
         * Information about the period during which the subscription will be valid.
         */
        validity: {
          /**
           * Subscription's start date in ISO 8601 format.
           */
          begin: string;
          /**
           * Subscription's end date in ISO 8601 format.
           */
          end: string;
        };
      };
    }[];
  }
  
  /**
   * Order's tax information.
   */
  export interface TaxData {
    /**
     * Indicates if the taxes were designated by the marketplace (`true`) or not (`false`).
     */
    areTaxesDesignatedByMarketplace: boolean;
    /**
     * Array with detailed tax information for each item.
     */
    taxInfoCollection: {
      /**
       * Index number of the item in the order.
       */
      itemIndex: number;
      /**
       * Alphanumeric sequence that identifies the item's SKU.
       */
      sku: string;
      /**
       * List of price tags associated with taxes for the item.
       */
      priceTags: {
        /**
         * Indicates if the tax is a percentage (`true`) or a fixed amount (`false`).
         */
        isPercentual: boolean;
        /**
         * Name of the tax.
         */
        name: string;
        /**
         * Amount associated with the tax, in raw format.
         */
        rawValue: string;
      }[];
    }[];
  }
  
  /**
   * Information about order cancellation, when it applies.
   */
  export interface CancellationData {
    /**
     * Indicates if the order cancellation was requested by the customer (`true`) or not (`false`).
     */
    RequestedByUser: boolean;
    /**
     * Indicates if the order cancellation was made by the system (`true`) or not (`false`).
     */
    RequestedBySystem: boolean;
    /**
     * Indicates if the order cancellation was requested by the seller (`true`) or not (`false`).
     */
    RequestedBySellerNotification: boolean;
    /**
     * Indicates if the order cancellation was requested by the payment gateway (`true`) or not (`false`).
     */
    RequestedByPaymentNotification: boolean;
    /**
     * The reason provided for the cancellation of the order.
     */
    Reason: string;
    /**
     * The date and time when the order was canceled, in ISO 8601 format.
     */
    CancellationDate: string;
  }
  
  export interface OrderMacroData {
    orders: {
      orderId: string;
      creationDate: string;
      clientName: string;
      totalValue: number;
      status: string;
      discountValue?: number;
      formattedTotalValue: string | null;
    }[];
    ordersItems: {
      productId: string;
      productName: string;
      productQuantity: number;
      productTotalValue: number;
      formattedProductTotalValue: string | null;
    }[];
    periodTotalOrders: number;
    periodTotalValue: number;
    formattedPeriodTotalValue: string | null;
  }
  
  export interface OrderResponse {
    list: {
      orderId: string;
      creationDate: string;
      clientName: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>;
      totalValue: number;
      paymentNames: string;
      status: string;
      statusDescription: string;
      marketPlaceOrderId?: string;
      sequence: string;
      salesChannel: string;
      affiliateId?: string;
      origin: string;
      workflowInErrorState: boolean;
      workflowInRetry: boolean;
      lastMessageUnread: string;
      ShippingEstimatedDate?: string;
      ShippingEstimatedDateMax?: string;
      ShippingEstimatedDateMin?: string;
      orderIsComplete: boolean;
      listId?: string;
      listType?: string;
    }[];
    paging: {
      total: number;
      pages: number;
      currentPage: number;
      perPage: number;
    };
  }
  
  export interface OrderItemsList {
    orderId: string;
    items: OrderItem[];
  }
  