import {
  DeliveryDiscountSelectionStrategy,
  DiscountClass,
} from "../generated/api";

/**
  * @typedef {import("../generated/api").DeliveryInput} RunInput
  * @typedef {import("../generated/api").CartDeliveryOptionsDiscountsGenerateRunResult} CartDeliveryOptionsDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartDeliveryOptionsDiscountsGenerateRunResult}
  */

export function cartDeliveryOptionsDiscountsGenerateRun(input) {
  console.log('🚢 cartDeliveryOptionsDiscountsGenerateRun function STARTED');
  console.log('📥 Input received:', JSON.stringify(input, null, 2));

  const firstDeliveryGroup = input.cart.deliveryGroups[0];
  if (!firstDeliveryGroup) {
    console.log('❌ No delivery groups found - throwing error');
    throw new Error("No delivery groups found");
  }

  console.log('📦 Delivery group found:', {
    id: firstDeliveryGroup.id,
    deliveryOptions: firstDeliveryGroup.deliveryOptions?.length || 0
  });

  const hasShippingDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Shipping,
  );

  console.log('🎯 Discount classes found:', {
    hasShippingDiscountClass,
    discountClasses: input.discount.discountClasses
  });

  if (!hasShippingDiscountClass) {
    console.log('⚠️ No shipping discount class - returning empty operations');
    return { operations: [] };
  }

  console.log('✅ Adding SHIPPING discount operation (FREE DELIVERY)');

  const operations = [
    {
      deliveryDiscountsAdd: {
        candidates: [
          {
            message: "FREE DELIVERY",
            targets: [
              {
                deliveryGroup: {
                  id: firstDeliveryGroup.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          },
        ],
        selectionStrategy: DeliveryDiscountSelectionStrategy.All,
      },
    },
  ];

  console.log('🎉 Function completed successfully!');
  console.log('📤 Returning operations:', JSON.stringify(operations, null, 2));

  return {
    operations,
  };
}