import type { Coupon, Product } from "@prisma/client";

type CartProduct = {
  quantity: number;
  product: Pick<Product, "price" | "weight" | "stock">;
};

export function calculateDiscount(subtotal: number, coupon?: Coupon | null) {
  if (!coupon || !coupon.isActive) return 0;
  if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) return 0;

  if (coupon.type === "PERCENTAGE") {
    return subtotal * (Number(coupon.value) / 100);
  }

  return Number(coupon.value);
}

export function calculateShipping(items: CartProduct[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.product.weight * item.quantity, 0);
  const base = 19.9;
  return Number((base + totalWeight * 2.4).toFixed(2));
}
