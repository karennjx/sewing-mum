import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-berry uppercase">
        Nothing here
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink">
        This page has come apart at the seams
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        The page you were after does not exist, or a piece has been retired.
        Everything currently being made is on the products page.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
      >
        Browse products
      </Link>
    </div>
  );
}
