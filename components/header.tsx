import Link from "next/link";
import { CartButton } from "./cart/cart-button";
import { Lockup } from "./logo";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "Story" },
  { href: "/story#the-cloth", label: "The Cloth" },
  { href: "/shipping", label: "Shipping" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-paper">
      <div className="container-page grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="label hover:underline hover:underline-offset-4">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" aria-label="Pampera — home" className="md:col-start-2">
          <Lockup />
        </Link>
        <div className="col-start-3 justify-self-end">
          <CartButton />
        </div>
      </div>
      <nav
        aria-label="Main"
        className="label flex h-11 items-center gap-7 overflow-x-auto border-y border-line px-3 whitespace-nowrap md:hidden"
      >
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
