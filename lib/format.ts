import type { Money } from "./commerce/types";

export function formatMoney({ amount, currencyCode }: Money): string {
  const value = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

/** "3 of 3 left" style copy for an edition-limited variant. */
export function stockLabel(quantity: number | null, editionSize: number | undefined): string | null {
  if (quantity === null) return null;
  if (quantity <= 0) return "Sold out";
  if (editionSize) return `${quantity} of ${editionSize} left`;
  return quantity === 1 ? "Last one" : `${quantity} left`;
}
