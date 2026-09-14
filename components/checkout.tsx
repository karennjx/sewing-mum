"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  cartTotal,
  clearCart,
  describeLines,
  money,
  resolveCartLines,
  useCart,
  type CartProduct,
  type ResolvedLine,
} from "@/lib/cart";
import { orderReference, paynowPayload } from "@/lib/paynow";
import { site, whatsappLink } from "@/lib/site";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

type Stage = "details" | "pay" | "done";

type Contact = { email: string; mobile: string };

/**
 * Whether a copy of the order went out by email. "quiet" covers the case
 * worth being careful about: the email sent, but only to us, because Resend's
 * test sender cannot reach anyone but the account owner. Telling the shopper
 * a copy is on its way would be a lie until a domain is verified.
 */
type Receipt = "idle" | "sending" | "shopper" | "quiet" | "failed";

/** Deliberately loose. A rejected address that was actually fine is worse
 *  than a typo we catch later, when a person reads every order anyway. */
function emailLooksWrong(email: string): boolean {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Singapore mobiles are eight digits starting 8 or 9. Spaces and a +65 are
 *  stripped first, because people type their number however they think of it. */
function mobileLooksWrong(mobile: string): boolean {
  const digits = mobile.replace(/[\s-]/g, "").replace(/^\+?65/, "");
  return !/^[89]\d{7}$/.test(digits);
}

export function Checkout({ products }: { products: readonly CartProduct[] }) {
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);
  const cart = useCart();

  const [stage, setStage] = useState<Stage>("details");
  const [contact, setContact] = useState<Contact>({ email: "", mobile: "" });
  const [showErrors, setShowErrors] = useState(false);
  // Kept so the confirmation can still show the order after the cart is
  // emptied, and so the amount on the QR cannot shift under a shopper who
  // has another tab open.
  const [placed, setPlaced] = useState<{
    lines: ResolvedLine[];
    total: number;
    reference: string;
  } | null>(null);
  const [receipt, setReceipt] = useState<Receipt>("idle");

  const lines = useMemo(
    () => resolveCartLines(cart, products),
    [cart, products],
  );
  const total = cartTotal(lines);

  if (!hydrated) {
    return <p className="mt-10 text-muted">Getting your order…</p>;
  }

  if (lines.length === 0 && placed === null) {
    return (
      <div className="mt-10">
        <p className="leading-relaxed text-muted">
          There is nothing to check out.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
        >
          Have a look at what we make
        </Link>
      </div>
    );
  }

  const errors = {
    email: emailLooksWrong(contact.email),
    mobile: mobileLooksWrong(contact.mobile),
  };

  if (stage === "details") {
    return (
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (errors.email || errors.mobile) {
            setShowErrors(true);
            return;
          }
          setPlaced({ lines, total, reference: orderReference() });
          setStage("pay");
        }}
        className="mt-8"
      >
        <Summary lines={lines} total={total} />

        <fieldset className="mt-8 border-t border-linen-dark/60 pt-6">
          <legend className="sr-only">How we reach you</legend>
          <h2 className="font-display text-lg font-semibold text-ink">
            How we reach you
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            We use these to confirm your payment, agree delivery, and tell you
            when your order is on its way. Nothing else.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={contact.email}
              invalid={showErrors && errors.email}
              error="That does not look like an email address."
              onChange={(email) => setContact((c) => ({ ...c, email }))}
            />
            <Field
              id="mobile"
              label="Mobile"
              type="tel"
              autoComplete="tel"
              placeholder="9123 4567"
              value={contact.mobile}
              invalid={showErrors && errors.mobile}
              error="Eight digits, starting with 8 or 9."
              onChange={(mobile) => setContact((c) => ({ ...c, mobile }))}
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
        >
          Continue to payment
        </button>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Next you will get a PayNow QR code for {money(total)}. Nothing is
          charged automatically and no card details are taken.
        </p>
      </form>
    );
  }

  if (placed === null) {
    return null;
  }

  const payload = paynowPayload({
    amount: placed.total,
    reference: placed.reference,
  });

  const orderMessage = [
    `Hi ${site.name}! I have just placed an order and paid by PayNow.`,
    `Reference: ${placed.reference}`,
    "",
    ...describeLines(placed.lines),
    `Total paid: ${money(placed.total)}`,
    "",
    `Email: ${contact.email.trim()}`,
    `Mobile: ${contact.mobile.trim()}`,
    "Could you confirm and let me know about delivery?",
  ].join("\n");

  const order = placed;

  /** Fire and forget. The email is a courtesy; the WhatsApp message is what
   *  actually reaches Kim, so nothing here may block or undo an order. */
  function emailACopy(): void {
    setReceipt("sending");
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: order.reference,
        email: contact.email.trim(),
        mobile: contact.mobile.trim(),
        lines: order.lines.map(({ line }) => line),
      }),
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          emailedShopper?: unknown;
          reason?: unknown;
        } | null;

        if (response.ok) {
          setReceipt(body?.emailedShopper === true ? "shopper" : "quiet");
          return;
        }
        // Email not being set up at all is our business, not the shopper's.
        // Only a real attempt that failed is worth apologising for.
        setReceipt(body?.reason === "not-configured" ? "quiet" : "failed");
      })
      .catch(() => {
        setReceipt("failed");
      });
  }

  if (stage === "done") {
    return (
      <div className="mt-10">
        <p className="font-display text-2xl font-semibold text-ink">
          Thank you — your order is with us.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Your reference is{" "}
          <span className="font-medium text-ink">{placed.reference}</span>. We
          will check the payment against it and message you on WhatsApp to
          confirm and sort out delivery. Every piece is made by hand, so we
          will tell you exactly what is ready.
        </p>
        {receipt === "shopper" ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A copy is on its way to {contact.email.trim()}.
          </p>
        ) : null}
        {receipt === "failed" ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We could not email you a copy just now, but your order is with us
            all the same.
          </p>
        ) : null}
        <div className="mt-8 border-t border-linen-dark/60 pt-6">
          <Summary lines={placed.lines} total={placed.total} />
        </div>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
        >
          Keep looking around
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Summary lines={placed.lines} total={placed.total} />

      <ol className="mt-8 space-y-8 border-t border-linen-dark/60 pt-8">
        <li>
          <Step number={1} title={`Pay ${money(placed.total)} by PayNow`} />
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Scan this with your banking app. The amount and reference are
            already in the code, so there is nothing to type in.
          </p>

          {/* Black on white regardless of the palette: a tinted QR is a QR
              that sometimes will not scan, and the brand is not worth that. */}
          <div className="mt-5 inline-block border border-linen-dark bg-white p-4">
            <QRCodeSVG
              value={payload}
              size={220}
              level="M"
              marginSize={4}
              bgColor="#ffffff"
              fgColor="#000000"
              title={`PayNow code for ${money(placed.total)}, reference ${placed.reference}`}
            />
          </div>

          <dl className="mt-5 space-y-1 text-sm">
            {[
              ["Paid to", `${site.name} · UEN ${site.paynowUen}`],
              ["Amount", money(placed.total)],
              ["Reference", placed.reference],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <dt className="text-muted">{label}:</dt>
                <dd className="font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Cannot scan? Pay to UEN {site.paynowUen} in your banking app and put{" "}
            {placed.reference} in the reference or comment field.
          </p>
        </li>

        <li>
          <Step number={2} title="Tell us about it" />
          <p className="mt-2 text-sm leading-relaxed text-muted">
            This part matters: a PayNow payment arrives on its own with only the
            reference attached, so this is how we know what you have bought and
            where to reach you.
          </p>
          <a
            href={whatsappLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              emailACopy();
              clearCart();
              setStage("done");
            }}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 font-medium text-cream transition-colors hover:bg-berry-dark"
          >
            Send my order on WhatsApp
          </a>
        </li>
      </ol>
    </div>
  );
}

function Step({ number, title }: { number: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-lg font-semibold text-ink">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-berry text-sm text-cream"
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

function Summary({
  lines,
  total,
}: {
  lines: readonly ResolvedLine[];
  total: number;
}) {
  return (
    <div>
      <ul className="space-y-2 text-sm">
        {lines.map(({ line, product, price }) => (
          <li
            key={`${line.slug}-${line.print ?? ""}`}
            className="flex justify-between gap-4"
          >
            <span className="text-ink">
              {line.quantity} &times; {product.name}
              {line.print ? (
                <span className="text-muted"> · {line.print}</span>
              ) : null}
            </span>
            <span className="font-medium text-ink tabular-nums">
              {money(price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-linen-dark/60 pt-4">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display text-lg font-semibold text-ink tabular-nums">
          {money(total)}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Pieces only. Delivery is agreed with you separately.
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  value,
  invalid,
  error,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  invalid: boolean;
  error: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`mt-1.5 w-full border bg-white px-3 py-2.5 text-ink placeholder:text-muted/60 focus:outline-2 focus:outline-offset-2 focus:outline-berry ${
          invalid ? "border-berry" : "border-linen-dark"
        }`}
      />
      {invalid ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-berry">
          {error}
        </p>
      ) : null}
    </div>
  );
}
