import type { CleanEnquiry } from './enquiry.js';

/**
 * New-enquiry notification email, sent through Resend (resend.com).
 * RESEND_API_KEY — the API key; ENQUIRY_TO — who receives it (comma-separated for several addresses);
 * ENQUIRY_FROM — optional sender, e.g. "Golden Village Website <website@your-domain.com>" once a domain is verified.
 */

const apiKey = process.env.RESEND_API_KEY;
const recipients = (process.env.ENQUIRY_TO ?? '')
  .split(',')
  .map((address) => address.trim())
  .filter(Boolean);
const sender = process.env.ENQUIRY_FROM || 'Golden Village Website <onboarding@resend.dev>';

export const emailConfigured = () => Boolean(apiKey && recipients.length);

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

function rows(enquiry: CleanEnquiry, country: string | null): [string, string][] {
  const list: [string, string][] = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Phone / WhatsApp', enquiry.phone],
  ];
  if (enquiry.company) list.push(['Company', enquiry.company]);
  if (enquiry.country) list.push(['Country', enquiry.country]);
  if (enquiry.interests.length) list.push(['Interested in', enquiry.interests.join(', ')]);
  if (country) list.push(['Sent from (by IP)', country]);
  return list;
}

export async function sendEnquiryEmail(enquiry: CleanEnquiry, meta: { country: string | null; isTest: boolean }) {
  const subject = `${meta.isTest ? '[TEST] ' : ''}New catalog request — ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ''}`;
  const details = rows(enquiry, meta.country);
  const whatsapp = `https://wa.me/${enquiry.phone.replace(/\D/g, '')}`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1e1a12;max-width:600px">
  <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9d8048;margin:0 0 8px">Golden Village Furnitures · Website enquiry</p>
  <h2 style="font-weight:normal;margin:0 0 20px">New catalog request from ${escape(enquiry.name)}</h2>
  <table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">
    ${details
      .map(
        ([label, value]) =>
          `<tr><td style="color:#9d8048;width:150px;border-bottom:1px solid #f0e9da;vertical-align:top">${escape(label)}</td><td style="border-bottom:1px solid #f0e9da">${escape(value)}</td></tr>`,
      )
      .join('')}
  </table>
  <p style="color:#9d8048;font-size:13px;margin:24px 0 6px">Message</p>
  <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;margin:0;padding:14px 16px;background:#f9f5ee;border-radius:8px">${escape(enquiry.message)}</p>
  <p style="margin:24px 0 0;font-size:14px">
    <a href="mailto:${escape(enquiry.email)}" style="color:#9d8048">Reply by email</a> &nbsp;·&nbsp;
    <a href="${escape(whatsapp)}" style="color:#9d8048">Open WhatsApp chat</a>
  </p>
  <p style="color:#8a8070;font-size:12px;margin-top:28px">Replying to this email goes straight to the customer. The enquiry is also in the admin panel.</p>
</div>`;

  const text = [...details.map(([label, value]) => `${label}: ${value}`), '', 'Message:', enquiry.message].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: sender, to: recipients, reply_to: enquiry.email, subject, html, text }),
  });
  if (!response.ok) throw new Error(`Resend failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
}
