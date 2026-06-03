import { Resend } from "resend";
import { COMPANY } from "@/lib/data";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// FROM address. Use Resend's default sender until your domain is verified,
// then set EMAIL_FROM=noreply@sawangainvestments.com in Vercel env vars.
const FROM =
  process.env.EMAIL_FROM || `SAWANGA Investment <onboarding@resend.dev>`;
const TEAM_INBOX = COMPANY.email;

const shell = (title: string, body: string) => `
<div style="background:#06122e;padding:32px 0;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#0a1a3f;border:1px solid rgba(200,162,75,0.25);border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px;border-bottom:1px solid rgba(200,162,75,0.2);">
      <div style="color:#c8a24b;font-size:22px;font-weight:700;letter-spacing:2px;">SAWANGA</div>
      <div style="color:#9fb0d0;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Investment Limited</div>
    </div>
    <div style="padding:32px;color:#e7ebf3;font-size:15px;line-height:1.6;">
      <h2 style="color:#e4c677;font-size:18px;margin:0 0 16px;">${title}</h2>
      ${body}
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(200,162,75,0.2);color:#7f8db0;font-size:12px;">
      Finishes That Build Trust · ${COMPANY.location}<br/>
      ${COMPANY.phones.join(" · ")} · ${COMPANY.email}
    </div>
  </div>
</div>`;

const row = (label: string, value?: string) =>
  value
    ? `<p style="margin:4px 0;"><span style="color:#9fb0d0;">${label}:</span> <strong style="color:#fff;">${value}</strong></p>`
    : "";

export async function sendQuoteEmails(d: any) {
  if (!resend) return { skipped: true };
  const details = [
    row("Name", d.full_name),
    row("Email", d.email),
    row("Phone", d.phone),
    row("Customer type", d.customer_type),
    row("Company", d.company),
    row("Project type", d.project_type),
    row("Location", d.location),
    row("Products", Array.isArray(d.products) ? d.products.join(", ") : d.products),
    row("Budget", d.budget_range),
    row("Referral code", d.referral_code),
    d.message ? `<p style="margin:12px 0 0;color:#9fb0d0;">Message:</p><p style="margin:4px 0;color:#fff;">${d.message}</p>` : "",
  ].join("");

  await resend.emails.send({
    from: FROM,
    to: TEAM_INBOX,
    replyTo: d.email,
    subject: `New Quote Request — ${d.full_name} (${d.customer_type})`,
    html: shell("New Quotation Request", details),
  });

  await resend.emails.send({
    from: FROM,
    to: d.email,
    subject: "We received your quote request — SAWANGA Investment",
    html: shell(
      `Thank you, ${d.full_name.split(" ")[0]}`,
      `<p>We've received your request for a quotation and our team is on it. Expect to hear from us shortly.</p>
       <p style="margin-top:16px;">For anything urgent, reach us on <strong style="color:#e4c677;">${COMPANY.phones[0]}</strong> or WhatsApp.</p>
       <p style="margin-top:16px;color:#9fb0d0;">— The SAWANGA Team</p>`
    ),
  });
  return { sent: true };
}

export async function sendContactEmails(d: any) {
  if (!resend) return { skipped: true };
  const details = [
    row("Name", d.full_name),
    row("Email", d.email),
    row("Phone", d.phone),
    row("Subject", d.subject),
    `<p style="margin:12px 0 0;color:#9fb0d0;">Message:</p><p style="margin:4px 0;color:#fff;">${d.message}</p>`,
  ].join("");

  await resend.emails.send({
    from: FROM,
    to: TEAM_INBOX,
    replyTo: d.email,
    subject: `Contact form — ${d.subject || d.full_name}`,
    html: shell("New Contact Message", details),
  });

  await resend.emails.send({
    from: FROM,
    to: d.email,
    subject: "Thanks for reaching out — SAWANGA Investment",
    html: shell(
      `Hi ${d.full_name.split(" ")[0]}`,
      `<p>Thanks for getting in touch with SAWANGA Investment Limited. We've received your message and will respond as soon as possible.</p>
       <p style="margin-top:16px;color:#9fb0d0;">— The SAWANGA Team</p>`
    ),
  });
  return { sent: true };
}
