import { SITE_URL } from "@/lib/constants";

/**
 * Builds the staff email signature markup.
 *
 * Layout follows the three-column template: a brand column (logo, tagline,
 * social row), an identity column (name, role, address), and a contact stack,
 * separated by hairline accent rules on a white field.
 *
 * Everything here is constrained by Gmail's sanitiser, which is far stricter
 * than a browser:
 *   - <style> blocks, class and id attributes are stripped -> inline styles only
 *   - data: URIs are stripped -> every image must be an absolute hosted URL
 *   - inline <svg> is stripped -> icons are PNGs (see
 *     scripts/build-email-signature-assets.mjs)
 *   - flexbox/grid/position are unsupported -> nested tables carry the layout
 *   - unstyled <a> is recoloured blue -> every link sets its own colour
 */

// Brand palette, mirroring src/app/globals.css. BRAND_RED is sampled from the
// logo mark itself (deep oxblood, not a bright red).
const BRAND_RED = "#9B1B1C";
const BRAND_DARK = "#1C1C1E";
const ACCENT = "#B8963E"; // --accent-gold; carries the rules, rings and role
const TEXT = "#333335";
const NOTICE_TEXT = "#9A9A9A";

// The site's body font (--font-jakarta) resolves to Arial, so this stack is an
// exact match for econstructhomes.com rather than an email-safe compromise.
const FONT_STACK = "Arial, Helvetica, sans-serif";

/** Fixed brand line, taken from the site footer. */
const TAGLINE = "Los Angeles&rsquo; premier high-end residential contractor";

/** Absolute asset base — the only form Gmail will actually load. */
export const ABSOLUTE_ASSET_BASE = `${SITE_URL}/email`;

/**
 * Relative base, used only for the on-page preview so it renders against
 * locally served files during development and before the assets are deployed.
 */
export const PREVIEW_ASSET_BASE = "/email";

export const SOCIAL_LINKS = [
  { key: "x", label: "X", href: "https://x.com/econstructinc" },
  { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/econstruct-inc/" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com/econstructinc" },
  { key: "youtube", label: "YouTube", href: "https://youtube.com/@econstructinc" },
  { key: "facebook", label: "Facebook", href: "https://facebook.com/econstructinc3" },
] as const;

export interface SignatureInput {
  fullName: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  includeConfidentiality: boolean;
}

export const SIGNATURE_DEFAULTS: SignatureInput = {
  fullName: "",
  department: "",
  jobTitle: "",
  email: "",
  phone: "310.740.9999",
  address: "25350 Magic Mountain Pkwy #300, Valencia, CA 91355",
  includeConfidentiality: true,
};

/** Escapes text destined for an HTML text node or a double-quoted attribute. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "310.740.9999" -> "+13107409999" for a tel: href. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

/** One icon + label pair. `size` differs between the ring icons and the pin. */
function iconRow(
  iconSrc: string,
  size: number,
  inner: string,
  opts: { align?: string; color?: string; fontSize?: number } = {}
): string {
  const valign = opts.align ?? "middle";
  return (
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>` +
    `<td valign="${valign}" style="padding:0 9px 0 0;line-height:0;">` +
    `<img src="${iconSrc}" width="${size}" height="${size}" alt="" style="display:block;border:0;outline:none;text-decoration:none;" /></td>` +
    `<td valign="${valign}" style="font-family:${FONT_STACK};font-size:${opts.fontSize ?? 11.5}px;line-height:1.5;color:${opts.color ?? TEXT};">${inner}</td>` +
    `</tr></table>`
  );
}

/**
 * Forces a break after the street portion instead of leaving it to the
 * email client's own text wrap — table-cell wrapping is unreliable across
 * clients (Outlook in particular), so this splits on the first comma
 * ("25350 Magic Mountain Pkwy #300," / "Valencia, CA 91355") rather than
 * trusting the container width.
 */
function addressWithLineBreak(address: string): string {
  const commaIndex = address.indexOf(",");
  if (commaIndex === -1) return address;
  const line1 = address.slice(0, commaIndex + 1);
  const line2 = address.slice(commaIndex + 1).trim();
  return `${line1}<br />${line2}`;
}

export interface BuildOptions {
  /**
   * Base URL for the image assets. Defaults to the absolute production base,
   * which is what must ship into Gmail. Pass PREVIEW_ASSET_BASE for on-page
   * rendering so the preview survives local development.
   */
  assetBase?: string;
}

export function buildSignatureHtml(input: SignatureInput, options: BuildOptions = {}): string {
  const assets = options.assetBase ?? ABSOLUTE_ASSET_BASE;
  const fullName = esc(input.fullName.trim()) || "Your Name";
  const department = esc(input.department.trim().toUpperCase());
  const jobTitle = esc(input.jobTitle.trim());
  const email = esc(input.email.trim());
  const phone = esc(input.phone.trim());
  const address = esc(input.address.trim());
  const tel = esc(telHref(input.phone));

  // ---- column 1: brand -------------------------------------------------
  const socialIcons = SOCIAL_LINKS.map(
    (s, i) =>
      `<td style="padding:0 0 0 ${i === 0 ? "0" : "9px"};line-height:0;">` +
      `<a href="${s.href}" target="_blank" style="text-decoration:none;border:0;">` +
      `<img src="${assets}/social-${s.key}.png" width="10" height="10" alt="${s.label}" style="display:block;border:0;outline:none;text-decoration:none;" />` +
      `</a></td>`
  ).join("");

  const brandColumn =
    `<img src="${assets}/econstruct-logo.png" width="113" height="38" alt="econstruct" style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto;" />` +
    `<div style="font-family:${FONT_STACK};font-size:10.5px;line-height:1.55;color:${ACCENT};padding:11px 6px 0 6px;">${TAGLINE}</div>`;

  // ---- column 2: identity ----------------------------------------------
  const departmentBlock = department
    ? `<div style="font-family:${FONT_STACK};font-size:9.5px;line-height:1;letter-spacing:1.5px;font-weight:bold;color:${BRAND_RED};padding:0 0 7px 0;">${department}</div>`
    : "";

  const titleBlock = jobTitle
    ? `<div style="font-family:${FONT_STACK};font-size:12.5px;line-height:1.4;color:${ACCENT};padding:3px 0 0 0;">${jobTitle}</div>`
    : "";

  const addressBlock = address
    ? `<div style="padding:15px 0 0 0;">${iconRow(
        `${assets}/icon-pin.png`,
        14,
        addressWithLineBreak(address),
        { align: "top", fontSize: 10 }
      )}</div>`
    : "";

  const identityColumn =
    departmentBlock +
    `<div style="font-family:${FONT_STACK};font-size:19px;line-height:1.25;font-weight:bold;color:${BRAND_DARK};">${fullName}</div>` +
    titleBlock +
    addressBlock;

  // ---- column 3: contact stack -----------------------------------------
  const contactRows = [
    phone
      ? iconRow(
          `${assets}/icon-phone.png`,
          18,
          `<a href="tel:${tel}" style="color:${TEXT};text-decoration:none;">${phone}</a>`
        )
      : "",
    email
      ? iconRow(
          `${assets}/icon-email.png`,
          18,
          `<a href="mailto:${email}" style="color:${TEXT};text-decoration:none;">${email}</a>`
        )
      : "",
    iconRow(
      `${assets}/icon-website.png`,
      18,
      `<a href="${SITE_URL}" target="_blank" style="color:${TEXT};text-decoration:none;">econstructhomes.com</a>`
    ),
  ]
    .filter(Boolean)
    .map((row, i) => `<tr><td style="padding:${i === 0 ? "0" : "10px"} 0 0 0;">${row}</td></tr>`)
    .join("");

  // Social row sits beneath the contact stack, aligned to the ring icons.
  const socialRow =
    `<tr><td style="padding:14px 0 0 0;">` +
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${socialIcons}</tr></table>` +
    `</td></tr>`;

  const contactColumn =
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactRows}${socialRow}</table>`;

  // Rules are drawn as cell borders rather than spacer cells — Outlook
  // collapses narrow cells but honours td borders.
  const rule = `border-left:2px solid ${BRAND_DARK};`;

  // Closing rule beneath the three columns, matching the vertical dividers.
  const bottomRule =
    `<tr><td colspan="3" style="font-size:0;line-height:0;height:20px;">&nbsp;</td></tr>` +
    `<tr><td colspan="3" height="2" style="height:2px;line-height:2px;font-size:0;background-color:${BRAND_DARK};">&nbsp;</td></tr>`;

  // Condensed from the legacy notice: same legal force, roughly half the words.
  // The year is baked in when the signature is generated.
  const year = new Date().getFullYear();
  const noticeStyle = `font-family:${FONT_STACK};font-size:9.5px;line-height:1.6;color:${NOTICE_TEXT};`;
  const confidentiality = input.includeConfidentiality
    ? `<tr><td colspan="3" style="padding:15px 2px 0 2px;">` +
      `<div style="${noticeStyle}">` +
      `<span style="font-weight:bold;">NOTICE &mdash; CONFIDENTIAL:</span> This communication is privileged and ` +
      `strictly confidential, intended solely for the named recipient. If you are not the intended recipient, any ` +
      `dissemination, distribution, or copying is strictly prohibited. If you received this in error, please notify ` +
      `the sender immediately and delete all copies.` +
      `</div>` +
      `<div style="${noticeStyle}padding:5px 0 0 0;">` +
      `&copy; ${year} econstruct. All rights reserved. &middot; CA License #964015` +
      `</div>` +
      `</td></tr>`
    : "";

  return (
    // Column widths are pinned so the address wraps inside its column instead
    // of stretching the whole signature into one unbroken line. The `width`
    // attribute on a td covers padding and border too, so these totals — not
    // the content boxes — are what must add up to the table width.
    //   176 + 260 + 204 = 640
    `<table cellpadding="0" cellspacing="0" border="0" width="640" style="border-collapse:collapse;font-family:${FONT_STACK};background-color:#FFFFFF;width:640px;">` +
      `<tr>` +
        `<td valign="middle" align="center" width="176" style="width:176px;padding:0 16px 0 0;">${brandColumn}</td>` +
        `<td valign="middle" width="260" style="width:260px;padding:2px 16px;${rule}">${identityColumn}</td>` +
        `<td valign="middle" width="204" style="width:204px;padding:2px 0 2px 16px;${rule}">${contactColumn}</td>` +
      `</tr>` +
      bottomRule +
      confidentiality +
    `</table>`
  );
}
