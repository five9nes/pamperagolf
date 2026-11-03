import Link from "next/link";
import { Mark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Mark className="h-10 w-auto text-coral" />
      <h1 className="title mt-8 text-3xl">Out of bounds</h1>
      <p className="mt-3 text-[13px] text-muted">That page isn&rsquo;t here — it may have sold through.</p>
      <Link href="/shop" className="btn-light mt-8 border border-ink">
        Back to the collection
      </Link>
    </div>
  );
}
