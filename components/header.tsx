"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/lib/motion";
import { site } from "@/lib/site";
import { CartButton } from "./cart/cart-button";
import { Mark, Wordmark } from "./logo";

const explore = [
  { href: "/story", label: "Our Story" },
  { href: "/story#the-cloth", label: "The Cloth" },
  { href: "/story#the-process", label: "The Process" },
];

const menu = [{ href: "/shop", label: `Shop ${site.collection.title}` }, ...explore, { href: "/shipping", label: "Shipping" }];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="w-fit bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-px transition-[background-size] duration-500 ease-expo hover:bg-[length:100%_1px]">
      {children}
    </Link>
  );
}

/**
 * Fixed header: switches to light type over any [data-tone="dark"] section, tucks away
 * while scrolling down and returns (with a backing) on the way back up.
 */
export function Header() {
  const pathname = usePathname();
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setAtTop(y < 12);
      if (Math.abs(y - lastY) > 4) setHidden(y > lastY && y > 160);
      lastY = y;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 28)
        .find((el) => !header.current?.contains(el));
      setTone(under?.closest('[data-tone="dark"]') ? "dark" : "light");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (menuOpen && !el.open) el.showModal();
    if (!menuOpen && el.open) el.close();
    lockScroll(menuOpen);
  }, [menuOpen]);

  const dark = tone === "dark";
  const backing = !atTop && !hidden;

  return (
    <header
      ref={header}
      className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color,color] duration-500 ease-expo ${
        hidden ? "-translate-y-full" : ""
      } ${dark ? "text-paper" : "text-ink"} ${
        backing ? (dark ? "bg-coal/80 backdrop-blur-md" : "bg-paper/80 backdrop-blur-md") : "bg-transparent"
      }`}
    >
      <div className="container-page grid min-h-14 grid-cols-[1fr_auto] items-start gap-4 py-4 md:min-h-16 md:grid-cols-12 md:pt-5">
        <Link href="/" aria-label={`${site.name} — home`} className="flex items-center gap-2 md:col-span-3">
          <Mark className="h-5 w-auto text-coral" />
          <span className="relative">
            <Wordmark className={`h-[17px] w-auto transition-opacity duration-300 ${dark ? "opacity-0" : ""}`} preload />
            <Wordmark
              tone="bone"
              className={`absolute inset-0 h-[17px] w-auto transition-opacity duration-300 ${dark ? "" : "opacity-0"}`}
            />
          </span>
        </Link>

        <nav aria-label="Main" className="hidden text-[12px] font-medium md:contents">
          <div className="col-span-2">
            <NavLink href="/shop">Shop</NavLink>
          </div>
          <div className="col-span-3 flex flex-col leading-snug">
            {explore.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="col-span-2">
            <NavLink href="/shipping">Shipping</NavLink>
          </div>
        </nav>

        <div className="flex items-center gap-5 justify-self-end text-[12px] font-medium md:col-span-2">
          <button type="button" onClick={() => setMenuOpen(true)} className="md:hidden" aria-haspopup="dialog">
            Menu
          </button>
          <CartButton />
        </div>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setMenuOpen(false)}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-coral p-0 text-ink open:flex open:flex-col"
      >
        <div className="container-page flex h-14 items-center justify-between">
          <Mark className="h-[18px] w-auto" />
          <button type="button" onClick={() => setMenuOpen(false)} className="text-[12px] font-medium">
            Close
          </button>
        </div>
        <nav aria-label="Menu" className="container-page mt-auto flex flex-col gap-1 pb-10">
          {menu.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="display flex items-baseline gap-3 text-[2.75rem]"
            >
              <span className="label tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
          <p className="label mt-8">{site.leadTime}</p>
        </nav>
      </dialog>
    </header>
  );
}
