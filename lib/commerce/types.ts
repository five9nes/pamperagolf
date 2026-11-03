export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  /** Units left. Null when the Storefront token lacks the inventory scope. */
  quantityAvailable: number | null;
  price: Money;
  selectedOptions: SelectedOption[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  /** Short line shown under the title, e.g. "Mustard on undyed wool". */
  subtitle: string | null;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  images: Image[];
  variants: Variant[];
  seo: { title: string | null; description: string | null };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    quantityAvailable: number | null;
    price: Money;
    product: { handle: string; title: string; featuredImage: Image | null };
  };
};

export type Cart = {
  id: string;
  /** Shopify-hosted checkout. Null in preview mode. */
  checkoutUrl: string | null;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};

export interface CommerceProvider {
  readonly mode: "shopify" | "preview";
  getCollectionProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | undefined>;
  getCart(cartId: string): Promise<Cart | undefined>;
  createCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart>;
  addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart>;
  updateCart(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart>;
  removeFromCart(cartId: string, lineIds: string[]): Promise<Cart>;
}
