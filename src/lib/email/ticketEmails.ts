import { Resend } from "resend";

const FROM = "econstruct Support <no-reply@econstructinc.com>";
const DREW_EMAIL = "dq@drewquevedo.com";
const FRANK_EMAIL = "frank@econstructinc.com";
const KATIE_EMAIL = "katie@econstructinc.com";
const SITE_URL = "https://econstructhomes.com";

export type TicketForEmail = {
  id: string;
  ref_number: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  website: string | null;
  due_date: string | null;
  submitted_by: string;
  assigned_to: string;
};

const WEBSITE_TAG: Record<string, string> = {
  inc: "INC",
  homes: "HOMES",
  crm: "CRM",
};

const WEBSITE_FULL: Record<string, string> = {
  inc: "INC — econstructinc.com",
  homes: "HOMES — econstructhomes.com",
  crm: "CRM / Internal",
};

/** "[HOMES] " subject prefix, or empty for legacy tickets without a site. */
function siteTag(ticket: TicketForEmail) {
  const tag = ticket.website ? WEBSITE_TAG[ticket.website] : undefined;
  return tag ? `[${tag}] ` : "";
}

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[ticketEmails] RESEND_API_KEY not set — skipping email send");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function ticketUrl(ticket: TicketForEmail) {
  return `${SITE_URL}/crm/support/${ticket.id}`;
}

function wrap(subject: string, bodyHtml: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#1C1C1E;padding:24px 32px;border-radius:12px 12px 0 0;">
        <p style="color:#B8963E;font-weight:700;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">econstruct CRM &middot; Support</p>
        <h1 style="color:#ffffff;font-size:20px;margin:8px 0 0;">${subject}</h1>
      </div>
      <div style="background:#F8F6F2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e2db;">
        ${bodyHtml}
        <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e2db;font-size:12px;"><a href="https://econstructhomes.com/crm/support" style="color:#B8963E;text-decoration:none;font-weight:600;">View All Tickets →</a></p>
      </div>
    </div>
  `;
}

function ticketTable(ticket: TicketForEmail) {
  return `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${ticket.website ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;width:35%;font-weight:600;">Website</td><td style="padding:8px 0;font-size:14px;font-weight:700;">${WEBSITE_FULL[ticket.website] ?? ticket.website}</td></tr>` : ""}
      <tr><td style="padding:8px 0;font-size:13px;color:#666;width:35%;font-weight:600;">Category</td><td style="padding:8px 0;font-size:14px;">${ticket.category}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Priority</td><td style="padding:8px 0;font-size:14px;">${ticket.priority}</td></tr>
      ${ticket.due_date ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Due Date</td><td style="padding:8px 0;font-size:14px;">${ticket.due_date}</td></tr>` : ""}
      ${ticket.description ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;vertical-align:top;">Description</td><td style="padding:8px 0;font-size:14px;">${ticket.description}</td></tr>` : ""}
    </table>
  `;
}

function ctaButton(url: string, label: string) {
  return `<a href="${url}" style="display:inline-block;background:#B8963E;color:#ffffff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">${label}</a>`;
}

export async function notifyDrewNewTicket(ticket: TicketForEmail) {
  const resend = getResend();
  if (!resend) return;
  const subject = `${siteTag(ticket)}New Support Ticket #REQ-${ticket.ref_number}: ${ticket.title}`;
  await resend.emails
    .send({
      from: FROM,
      to: DREW_EMAIL,
      subject,
      html: wrap(
        subject,
        `${ticketTable(ticket)}${ctaButton(ticketUrl(ticket), "Open Ticket")}`
      ),
    })
    .catch((err) => console.error("[ticketEmails] notifyDrewNewTicket failed:", err));
}

export async function notifyFrankForReview(ticket: TicketForEmail) {
  const resend = getResend();
  if (!resend) return;
  const subject = `${siteTag(ticket)}Ready for Your Review — #REQ-${ticket.ref_number}: ${ticket.title}`;
  await resend.emails
    .send({
      from: FROM,
      to: FRANK_EMAIL,
      cc: KATIE_EMAIL,
      subject,
      html: wrap(
        subject,
        `<p style="font-size:14px;margin:0 0 16px;">This ticket has been marked ready for your review.</p>${ticketTable(
          ticket
        )}${ctaButton(ticketUrl(ticket), "Review & Approve")}`
      ),
    })
    .catch((err) => console.error("[ticketEmails] notifyFrankForReview failed:", err));
}

export async function notifyDrewDecision(
  ticket: TicketForEmail,
  decision: "Approved" | "Sent Back"
) {
  const resend = getResend();
  if (!resend) return;
  const subject = `Ticket #REQ-${ticket.ref_number} ${decision}`;
  await resend.emails
    .send({
      from: FROM,
      to: DREW_EMAIL,
      subject,
      html: wrap(
        subject,
        `<p style="font-size:14px;margin:0 0 16px;">Frank ${decision === "Approved" ? "approved" : "sent back"} <strong>#REQ-${ticket.ref_number}: ${ticket.title}</strong>.</p>${ctaButton(
          ticketUrl(ticket),
          "Open Ticket"
        )}`
      ),
    })
    .catch((err) => console.error("[ticketEmails] notifyDrewDecision failed:", err));
}

export async function notifyOverdueTicket(tickets: TicketForEmail[]) {
  if (!tickets.length) return;
  const resend = getResend();
  if (!resend) return;

  const subject =
    tickets.length === 1
      ? `Overdue: #REQ-${tickets[0].ref_number}: ${tickets[0].title}`
      : `${tickets.length} Overdue Support Tickets`;

  const rows = tickets
    .map(
      (t) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e2db;">
            <a href="${ticketUrl(t)}" style="color:#1a1a1a;font-weight:600;text-decoration:none;">#REQ-${t.ref_number}: ${t.title}</a>
            <div style="font-size:12px;color:#666;margin-top:2px;">${t.category} &middot; ${t.priority} priority &middot; due ${t.due_date}</div>
          </td>
        </tr>`
    )
    .join("");

  await resend.emails
    .send({
      from: FROM,
      to: DREW_EMAIL,
      subject,
      html: wrap(
        subject,
        `<p style="font-size:14px;margin:0 0 16px;">${tickets.length} ticket${tickets.length === 1 ? " is" : "s are"} past due date:</p>
         <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">${rows}</table>`
      ),
    })
    .catch((err) => console.error("[ticketEmails] notifyOverdueTicket failed:", err));
}

export async function notifyNewComment(
  ticket: TicketForEmail,
  actor: string,
  note: string
) {
  const resend = getResend();
  if (!resend) return;
  // Phase 1 switched actor to the logged-in user's real full name (e.g.
  // "Frank Neimroozi"), so an exact match against "Frank" never fires —
  // startsWith keeps this working without needing the actor's email here.
  const recipient = actor.startsWith("Frank") ? DREW_EMAIL : FRANK_EMAIL;
  const subject = `New note on #REQ-${ticket.ref_number}: ${ticket.title}`;
  await resend.emails
    .send({
      from: FROM,
      to: recipient,
      subject,
      html: wrap(
        subject,
        `<p style="font-size:14px;margin:0 0 8px;"><strong>${actor}</strong> left a note:</p><p style="font-size:14px;background:#fff;border:1px solid #e5e2db;border-radius:8px;padding:12px;margin:0 0 20px;">${note}</p>${ctaButton(
          ticketUrl(ticket),
          "Open Ticket"
        )}`
      ),
    })
    .catch((err) => console.error("[ticketEmails] notifyNewComment failed:", err));
}
