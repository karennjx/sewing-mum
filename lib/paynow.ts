import { site } from "@/lib/site";

/**
 * Builds the string that goes inside a PayNow QR code.
 *
 * PayNow QRs are EMVCo merchant-presented codes: a run of tag-length-value
 * fields, with PayNow's own details nested inside tag 26 and a checksum on the
 * end. Because the format is public we can generate a code per order rather
 * than reuse one photographed QR, which buys two things worth having:
 *
 *  - the amount is written into the code and marked uneditable, so nobody
 *    can pay $2 for a $20 piece by mistyping in their banking app;
 *  - the order reference travels with the payment, so Kim can match what
 *    lands in the account against an order instead of guessing from the
 *    payer's name and the time of day.
 *
 * It does not make payment automatic. Money moves from the payer's bank to
 * the business account and nothing reports back here, so whatever the site
 * says after this, it is not "paid".
 */

/** One tag-length-value field. Lengths are two digits, so values cap at 99. */
function field(id: string, value: string): string {
  if (value.length > 99) {
    throw new Error(`PayNow field ${id} is too long at ${value.length}`);
  }
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

/**
 * CRC-16/CCITT-FALSE: polynomial 0x1021, starting at 0xFFFF, no reflection
 * and no final xor. Computed across the whole payload including the "6304"
 * that introduces the checksum itself.
 */
export function crc16(input: string): string {
  let crc = 0xffff;
  for (let index = 0; index < input.length; index += 1) {
    crc ^= input.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function paynowPayload({
  amount,
  reference,
}: {
  /** In dollars. Written to two decimal places, as the format expects. */
  amount: number;
  /** Shown to Kim beside the payment in her bank records. Max 25 characters. */
  reference: string;
}): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`PayNow amount must be positive, got ${amount}`);
  }

  const body = [
    field("00", "01"),
    // 12 marks a one-off code. These carry an amount and a reference for a
    // single order, so they are not the reusable kind (11).
    field("01", "12"),
    field(
      "26",
      [
        field("00", "SG.PAYNOW"),
        // 0 would mean a mobile number; 2 means a UEN.
        field("01", "2"),
        field("02", site.paynowUen),
        // 0 locks the amount in the payer's app. This is the whole reason for
        // generating a code per order rather than reusing one.
        field("03", "0"),
      ].join(""),
    ),
    // Not a categorised merchant, so the "no category" code.
    field("52", "0000"),
    // 702 is SGD.
    field("53", "702"),
    field("54", amount.toFixed(2)),
    field("58", "SG"),
    // What the payer sees they are paying. Capped at 25 by the format.
    field("59", site.name.slice(0, 25)),
    field("60", "Singapore"),
    field("62", field("01", reference.slice(0, 25))),
  ].join("");

  const withChecksumTag = `${body}6304`;
  return `${withChecksumTag}${crc16(withChecksumTag)}`;
}

const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * A short order reference, for the payment and for talking to Kim about it.
 *
 * No 0/O or 1/I, because these get read off a screen and typed into a banking
 * app, or read out over the phone. Random rather than counted up, since there
 * is no server to keep a counter — collisions do not matter much when Kim is
 * reading each order anyway, but there is enough here to make them unlikely.
 */
export function orderReference(): string {
  const size = 6;
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) {
    out += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return `SM${out}`;
}
