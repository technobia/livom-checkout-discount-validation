import {
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
} from '../generated/api';


/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  console.log('🚀 cartLinesDiscountsGenerateRun function STARTED');
  console.log('📥 Input received:', JSON.stringify(input, null, 2));

  if (!input.cart.lines.length) {
    console.log('❌ No cart lines found - throwing error');
    throw new Error('No cart lines found');
  }

  console.log(`📦 Cart has ${input.cart.lines.length} line(s)`);
  console.log('💰 Cart lines:', input.cart.lines.map(line => ({
    id: line.id,
    quantity: line.quantity,
    cost: line.cost.subtotalAmount
  })));

  const hasOrderDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Order,
  );
  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  console.log('🎯 Discount classes found:', {
    hasOrderDiscountClass,
    hasProductDiscountClass,
    discountClasses: input.discount.discountClasses
  });

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    console.log('⚠️ No matching discount classes - returning empty operations');
    return { operations: [] };
  }

  const maxCartLine = input.cart.lines.reduce((maxLine, line) => {
    if (line.cost.subtotalAmount.amount > maxLine.cost.subtotalAmount.amount) {
      return line;
    }
    return maxLine;
  }, input.cart.lines[0]);

  console.log('🏆 Max cart line selected:', {
    id: maxCartLine.id,
    cost: maxCartLine.cost.subtotalAmount
  });

  const operations = [];

  if (hasOrderDiscountClass) {
    console.log('✅ Adding ORDER discount operation (10% OFF)');
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: '10% OFF ORDER',
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: [],
                },
              },
            ],
            value: {
              percentage: {
                value: 10,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  }

  if (hasProductDiscountClass) {
    console.log('✅ Adding PRODUCT discount operation (20% OFF)');
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: '20% OFF PRODUCT',
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 20,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  console.log('🎉 Function completed successfully!');
  console.log('📤 Returning operations:', JSON.stringify(operations, null, 2));

  return {
    operations,
  };
}