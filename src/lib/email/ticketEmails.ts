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
  due_date: string | null;
  submitted_by: string;
  assigned_to: string;
};

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
  const subject = `New Support Ticket #REQ-${ticket.ref_number}: ${ticket.title}`;
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
  const subject = `Ready for Your Review — #REQ-${ticket.ref_number}: ${ticket.title}`;
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

export async function notifyNewComment(
  ticket: TicketForEmail,
  actor: string,
  note: string
) {
  const resend = getResend();
  if (!resend) return;
  const recipient = actor === "Frank" ? DREW_EMAIL : FRANK_EMAIL;
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
