import { env } from '../../config/env.js';
import { logger } from '../logger.js';
import { ResendMailer } from './resend.js';
import { ConsoleMailer } from './console.js';

export interface Mailer {
  send(msg: { to: string; subject: string; html: string }): Promise<void>;
}

// Resend when configured; console (logs links) otherwise — keeps dev unblocked.
export const mailer: Mailer = env.RESEND_API_KEY ? new ResendMailer() : new ConsoleMailer();
if (!env.RESEND_API_KEY) {
  logger.warn('RESEND_API_KEY not set — OTP + onboarding emails will be logged to the console (dev)');
}

// ── Shared branded layout ─────────────────────────────────────────────────────
// One inline-styled shell (email clients ignore <style>/external CSS) so every
// NordStern email looks consistent. `cta` renders an optional button.
function layout(opts: { heading: string; body: string; cta?: { label: string; url: string }; footnote?: string }): string {
  const brand = '#5a49c9';
  const button = opts.cta
    ? `<tr><td style="padding:8px 0 4px"><a href="${opts.cta.url}" style="display:inline-block;background:${brand};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:8px">${opts.cta.label}</a></td></tr>`
    : '';
  const foot = opts.footnote ? `<p style="margin:16px 0 0;font-size:12px;color:#8a8a99">${opts.footnote}</p>` : '';
  return `
  <div style="background:#f5f4f8;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;border:1px solid #ececf2">
        <tr><td style="padding:22px 28px;border-bottom:1px solid #f0eff5">
          <span style="font-size:16px;font-weight:700;color:#1a1a24">Nord<span style="color:${brand}">Stern</span></span>
        </td></tr>
        <tr><td style="padding:26px 28px 28px">
          <h1 style="margin:0 0 12px;font-size:19px;line-height:1.3;color:#1a1a24">${opts.heading}</h1>
          <div style="font-size:14px;line-height:1.6;color:#4a4a58">${opts.body}</div>
          <table role="presentation" cellpadding="0" cellspacing="0">${button}</table>
          ${foot}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#a4a4b0">Anchor infrastructure · testnet</p>
    </td></tr></table>
  </div>`;
}

async function deliver(to: string, subject: string, html: string): Promise<void> {
  await mailer.send({ to, subject, html });
}

// Lifecycle senders NEVER throw — onboarding must not fail because an email bounced.
// (OTP is the exception below: auth flows decide how to handle a send failure.)
async function fireAndForget(kind: string, to: string, subject: string, html: string): Promise<void> {
  try { await deliver(to, subject, html); }
  catch (err) { logger.warn({ err, kind, to }, 'onboarding email send failed'); }
}

// ── OTP (auth) — may throw so the caller can react ────────────────────────────
export async function sendOtpEmail(to: string, code: string) {
  await deliver(to, `${code} is your NordStern sign-in code`, layout({
    heading: 'Your sign-in code',
    body: `<p style="margin:0 0 10px">Use this one-time code to sign in:</p>
           <p style="font-size:30px;font-weight:700;letter-spacing:6px;color:#1a1a24;margin:0">${code}</p>`,
    footnote: 'Expires in 10 minutes. If you didn’t request it, you can ignore this email.',
  }));
}

// Legacy generic invitation (kept for the operator invitation flow).
export async function sendInvitationEmail(to: string, orgName: string, link: string) {
  await fireAndForget('invitation', to, `You're invited to ${orgName} on NordStern`, layout({
    heading: `You’re invited to ${orgName}`,
    body: `<p style="margin:0 0 6px">You’ve been invited to join <b>${orgName}</b> on NordStern.</p>`,
    cta: { label: 'Accept invitation', url: link },
  }));
}

// ── Onboarding lifecycle ──────────────────────────────────────────────────────

// Sent the moment a business submits an application.
export async function sendApplicationReceivedEmail(to: string, businessName: string) {
  await fireAndForget('application.received', to, 'We received your NordStern application', layout({
    heading: 'Application received',
    body: `<p style="margin:0 0 10px">Thanks${businessName ? `, <b>${businessName}</b>` : ''} — we’ve received your application to launch an anchor on NordStern.</p>
           <p style="margin:0">Our team will review your details and get back to you. No action is needed right now.</p>`,
  }));
}

// Sent on approval — carries the one-time redeem link that starts provisioning.
export async function sendApplicationApprovedEmail(to: string, businessName: string, redeemUrl: string) {
  await fireAndForget('application.approved', to, 'Your NordStern application is approved 🎉', layout({
    heading: 'You’re approved',
    body: `<p style="margin:0 0 10px">Great news${businessName ? `, <b>${businessName}</b>` : ''} — your application is approved.</p>
           <p style="margin:0 0 4px">Click below to set your subdomain, brand your anchor, and launch. This link is one-time and expires in 7 days.</p>`,
    cta: { label: 'Set up & launch your anchor', url: redeemUrl },
    footnote: redeemUrl,
  }));
}

// Sent on rejection.
export async function sendApplicationRejectedEmail(to: string, businessName: string) {
  await fireAndForget('application.rejected', to, 'Update on your NordStern application', layout({
    heading: 'Application update',
    body: `<p style="margin:0 0 10px">Thank you for your interest${businessName ? `, <b>${businessName}</b>` : ''}. After review, we’re unable to approve your anchor application at this time.</p>
           <p style="margin:0">If you think this was in error or your circumstances change, reply to this email and we’ll take another look.</p>`,
  }));
}

// Sent when provisioning finishes and the anchor is live.
export async function sendAnchorLiveEmail(to: string, businessName: string, loginUrl: string) {
  await fireAndForget('anchor.live', to, 'Your anchor is live on NordStern', layout({
    heading: 'Your anchor is live 🚀',
    body: `<p style="margin:0 0 10px">${businessName ? `<b>${businessName}</b>’s ` : 'Your '}anchor is provisioned and running on Stellar testnet.</p>
           <p style="margin:0">Sign in to your operator console to manage treasury, pricing, and credentials.</p>`,
    cta: { label: 'Open operator console', url: loginUrl },
  }));
}
