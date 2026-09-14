/**
 * Appends an order to the sheet this script is bound to.
 *
 * Not part of the site's build — it lives in Google, and is kept here so the
 * thing that writes the rows and the thing that reads them stay in step.
 *
 * Setting it up, once:
 *
 *  1. Make a Google Sheet called something like "Sewing Mums orders".
 *  2. Extensions -> Apps Script. Delete what is there, paste this in.
 *  3. Change SECRET below to a long random string of your own.
 *  4. Deploy -> New deployment -> Web app.
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Google will warn you and ask you to authorise it. That is expected:
 *     "Anyone" means anyone who knows the URL, which is why there is a
 *     secret as well.
 *  5. Copy the deployment URL. In Vercel, set:
 *       ORDER_SHEET_URL     = that URL
 *       ORDER_SHEET_SECRET  = the SECRET you chose
 *     Then redeploy, or the site will not see them.
 *
 * Changing this script later needs Deploy -> Manage deployments -> edit ->
 * New version, otherwise the old code keeps running on the same URL.
 */

const SECRET = "change-me-to-something-long-and-random";

const HEADINGS = [
  "When",
  "Reference",
  "Items",
  "Total (S$)",
  "Email",
  "Mobile",
  "Paid?",
  "Sent?",
  "Notes",
];

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // Guards against anyone who stumbles on the URL filling the sheet with
    // junk. Not real security; the sheet holds nothing worth stealing and
    // the URL is not published anywhere.
    if (body.secret !== SECRET) {
      return reply({ ok: false, reason: "bad-secret" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADINGS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      body.reference,
      body.items,
      body.total,
      body.email,
      body.mobile,
      // Left blank on purpose. Kim fills these in: "Paid?" once she has seen
      // the money against the reference, "Sent?" when it goes out. Nothing
      // automatic will ever write to them, so they are safe to use.
      "",
      "",
      "",
    ]);

    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, reason: String(error) });
  }
}
