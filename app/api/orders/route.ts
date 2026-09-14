import { Resend } from "resend";
import { formatPrice, getProductBySlug, isBuyable } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { site } from "@/lib/site";

/**
 * Emails a copy of an order, once, when the shopper says they have paid.
 *
 * This is the only server code in the project, and it is deliberately dumb:
 * it stores nothing, decides nothing, and the checkout does not depend on it
 * succeeding. The message the shopper sends on WhatsApp is still what
 * actually reaches Kim. This is a receipt, not a system of record.
 *
 * Two things it is careful about:
 *
 *  - Prices come from the catalogue, never from the request. The browser
 *    sends only what was chosen — slug, print, how many — so a tampered
 *    request cannot produce an email claiming a $2 bundle.
 *  - It never says the payment succeeded. Nothing reports back from PayNow,
 *    so the wording is that the order is here and the payment is being
 *    checked.
 */

type IncomingLine = {
  slug: string;
  print: string | null;
  quantity: number;
};

type Order = {
  reference: string;
  email: string;
  mobile: string;
  lines: readonly IncomingLine[];
};

type PricedLine = {
  name: string;
  print: string | null;
  quantity: number;
  amount: number;
};

/** As issued by `orderReference` in lib/paynow.ts. */
const REFERENCE = /^SM[2-9A-HJ-NP-Z]{6}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LINES = 20;
const MAX_QUANTITY = 99;

function isLine(value: unknown): value is IncomingLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    (line.print === null || typeof line.print === "string") &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity >= 1 &&
    line.quantity <= MAX_QUANTITY
  );
}

function readOrder(value: unknown): Order | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const body = value as Record<string, unknown>;
  const { reference, email, mobile, lines } = body;

  if (typeof reference !== "string" || !REFERENCE.test(reference)) {
    return null;
  }
  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return null;
  }
  if (typeof mobile !== "string" || mobile.trim().length === 0) {
    return null;
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) {
    return null;
  }
  if (!lines.every(isLine)) {
    return null;
  }

  return {
    reference,
    email: email.trim(),
    mobile: mobile.trim(),
    lines,
  };
}

/** A print is only valid if the product is actually made in it. */
function printIsValid(product: Product, print: string | null): boolean {
  if (!product.variants || product.variants.length === 0) {
    return print === null;
  }
  return (
    print !== null && product.variants.some((variant) => variant.name === print)
  );
}

/** Null if any line no longer describes something we sell. */
function priceOrder(lines: readonly IncomingLine[]): PricedLine[] | null {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product || !isBuyable(product) || product.price === null) {
      return null;
    }
    if (!printIsValid(product, line.print)) {
      return null;
    }
    priced.push({
      name: product.name,
      print: line.print,
      quantity: line.quantity,
      amount: product.price * line.quantity,
    });
  }
  return priced;
}

function describe(line: PricedLine): string {
  const print = line.print ? ` (${line.print.toLowerCase()})` : "";
  return `${line.quantity} x ${line.name}${print} — ${formatPrice(line.amount)}`;
}

function plainBody(order: Order, lines: PricedLine[], total: number): string {
  return [
    `Thank you — we have your order.`,
    ``,
    `Your reference is ${order.reference}. Please keep it: it is how we match`,
    `your payment to your order.`,
    ``,
    `What you ordered`,
    ...lines.map((line) => `  ${describe(line)}`),
    ``,
    `Total: ${formatPrice(total)} (pieces only — delivery is agreed separately)`,
    ``,
    `What happens next`,
    `We check the payment against your reference by hand, then message you on`,
    `WhatsApp to confirm and sort out delivery. Every piece is made by hand, so`,
    `we will tell you exactly what is ready. Nothing is charged automatically`,
    `and we hold no card details.`,
    ``,
    `Your details`,
    `  Email: ${order.email}`,
    `  Mobile: ${order.mobile}`,
    ``,
    `Anything at all, just reply to this email or message us on WhatsApp.`,
    ``,
    `${site.name} — ${site.tagline}`,
    site.url,
  ].join("\n");
}

function htmlBody(order: Order, lines: PricedLine[], total: number): string {
  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:6px 0;">${line.quantity} &times; ${line.name}${
          line.print
            ? ` <span style="color:#7c6669;">&middot; ${line.print.toLowerCase()}</span>`
            : ""
        }</td><td style="padding:6px 0;text-align:right;white-space:nowrap;">${formatPrice(
          line.amount,
        )}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,sans-serif;color:#3a2a2c;max-width:520px;line-height:1.6;">
  <h1 style="font-size:20px;margin:0 0 16px;">Thank you — we have your order.</h1>
  <p style="margin:0 0 16px;">Your reference is <strong>${order.reference}</strong>. Please keep it: it is how we match your payment to your order.</p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    ${rows}
    <tr><td style="padding:10px 0 0;border-top:1px solid #ecd2d4;"><strong>Total</strong></td><td style="padding:10px 0 0;border-top:1px solid #ecd2d4;text-align:right;"><strong>${formatPrice(
      total,
    )}</strong></td></tr>
  </table>
  <p style="margin:6px 0 20px;font-size:13px;color:#7c6669;">Pieces only — delivery is agreed with you separately.</p>
  <h2 style="font-size:16px;margin:0 0 8px;">What happens next</h2>
  <p style="margin:0 0 16px;">We check the payment against your reference by hand, then message you on WhatsApp to confirm and sort out delivery. Every piece is made by hand, so we will tell you exactly what is ready. Nothing is charged automatically and we hold no card details.</p>
  <p style="margin:0 0 16px;font-size:14px;color:#7c6669;">Your details: ${order.email} &middot; ${order.mobile}</p>
  <p style="margin:0 0 16px;">Anything at all, just reply to this email or message us on WhatsApp.</p>
  <p style="margin:0;font-size:13px;color:#7c6669;">${site.name} — ${site.tagline}<br><a href="${site.url}" style="color:#9a3346;">${site.url}</a></p>
</div>`;
}

/**
 * Appends a row to the order sheet, through an Apps Script bound to it.
 *
 * A spreadsheet rather than a database because the job is a list Kim can
 * read, sort and tick off, and she already knows how one works. It is not a
 * system of record either — it is written when the shopper says they have
 * paid, so an abandoned checkout leaves no row and a payment made without
 * coming back is still only visible in the bank.
 */
async function recordOrder(
  order: Order,
  lines: PricedLine[],
  total: number,
): Promise<boolean> {
  const url = process.env.ORDER_SHEET_URL;
  if (!url) {
    return false;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.ORDER_SHEET_SECRET ?? "",
        reference: order.reference,
        items: lines.map(describe).join("; "),
        total,
        email: order.email,
        mobile: order.mobile,
      }),
    });
    if (!response.ok) {
      console.error("Order sheet refused the row", response.status);
      return false;
    }
    // Apps Script answers 200 even when it rejects the row, so the body is
    // the only thing that says whether anything was actually written. A wrong
    // secret looks like success until you read it.
    const result = (await response.json().catch(() => null)) as {
      ok?: unknown;
      reason?: unknown;
    } | null;
    if (result?.ok !== true) {
      console.error("Order sheet rejected the row", result?.reason);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Order sheet write failed", error);
    return false;
  }
}

async function sendCopy(
  key: string,
  order: Order,
  lines: PricedLine[],
  total: number,
): Promise<{ ok: boolean; emailedShopper: boolean }> {
  const from =
    process.env.ORDER_EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;
  const owner = process.env.ORDER_EMAIL_TO ?? "karen.njx@gmail.com";
  // Resend's test sender can only reach the address that owns the account, so
  // until a domain is verified the shopper cannot be emailed at all and the
  // one copy goes to us. It carries their address in the body either way.
  const testSender = /resend\.dev>?\s*$/.test(from);

  const { error } = await new Resend(key).emails.send({
    from,
    to: testSender ? [owner] : [order.email],
    ...(testSender ? {} : { cc: [owner] }),
    replyTo: site.email,
    subject: `Order ${order.reference} — ${formatPrice(total)}`,
    text: plainBody(order, lines, total),
    html: htmlBody(order, lines, total),
  });

  if (error) {
    console.error("Order email failed", error);
    return { ok: false, emailedShopper: false };
  }
  return { ok: true, emailedShopper: !testSender };
}

function refuse(reason: string, status: number): Response {
  return Response.json({ ok: false, reason }, { status });
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key && !process.env.ORDER_SHEET_URL) {
    return refuse("not-configured", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return refuse("unreadable", 400);
  }

  const order = readOrder(body);
  if (!order) {
    return refuse("invalid", 400);
  }

  const lines = priceOrder(order.lines);
  if (!lines) {
    return refuse("unsellable", 409);
  }
  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  // Independent and both best effort: an unreachable sheet must not cost us
  // the email, and a bounced email must not cost us the row.
  const [recorded, sent] = await Promise.all([
    recordOrder(order, lines, total),
    key
      ? sendCopy(key, order, lines, total)
      : Promise.resolve({ ok: false, emailedShopper: false }),
  ]);

  if (!key) {
    return Response.json(
      { ok: false, reason: "not-configured", recorded },
      { status: 503 },
    );
  }
  if (!sent.ok) {
    return Response.json(
      { ok: false, reason: "send-failed", recorded },
      { status: 502 },
    );
  }
  return Response.json({
    ok: true,
    emailedShopper: sent.emailedShopper,
    recorded,
  });
}
