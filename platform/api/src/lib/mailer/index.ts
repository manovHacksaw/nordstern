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
// One inline-styled shell (email clients ignore <style>/external CSS) so every NordStern
// email looks consistent — colours + wordmark mirror the landing page (sole accent: purple).
const BRAND = '#6f5fd6';       // primary purple (landing --color-brand-700; reads on white)
const BRAND_DEEP = '#4b3f9e';  // landing --color-brand-800
const BRAND_TINT = '#f4f2fd';  // landing --color-brand-50
const INK = '#0b0b0b';         // landing --color-ink
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function layout(opts: { heading: string; body: string; cta?: { label: string; url: string }; footnote?: string }): string {
  const button = opts.cta
    ? `<tr><td style="padding:14px 0 4px"><a href="${opts.cta.url}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px">${opts.cta.label}</a></td></tr>`
    : '';
  const foot = opts.footnote ? `<p style="margin:18px 0 0;font-size:12px;color:#8a8a99">${opts.footnote}</p>` : '';
  return `
  <div style="background:${BRAND_TINT};padding:40px 0;font-family:${FONT}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eae7f6;box-shadow:0 1px 3px rgba(75,63,158,0.06)">
        <tr><td style="height:4px;background:linear-gradient(90deg,${BRAND} 0%,#ab9ff2 100%)"></td></tr>
        <tr><td style="padding:24px 30px 20px;border-bottom:1px solid #f2f0fa">
          <span style="font-size:17px;font-weight:800;letter-spacing:-0.3px;color:${INK}">Nord<span style="color:${BRAND}">Stern</span></span>
        </td></tr>
        <tr><td style="padding:28px 30px 30px">
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;font-weight:700;color:${INK}">${opts.heading}</h1>
          <div style="font-size:14px;line-height:1.65;color:#4a4a58">${opts.body}</div>
          <table role="presentation" cellpadding="0" cellspacing="0">${button}</table>
          ${foot}
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:11px;color:#a49fc0">NordStern · Anchor infrastructure on Stellar · testnet</p>
    </td></tr></table>
  </div>`;
}

// A branded code chip for OTP emails (big, spaced, purple-tinted).
function codeBlock(code: string): string {
  return `<div style="margin:6px 0 2px;padding:16px 0;background:${BRAND_TINT};border:1px solid #e6e2f7;border-radius:12px;text-align:center">
    <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:${BRAND_DEEP};font-family:${FONT}">${code}</span>
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
// The message is tailored to WHO is signing in, so an operator and a customer never get the
// same generic email:
//   • operator → their NordStern operator console (manages the anchor)
//   • customer → their account on a specific anchor (buy/sell), named when we know it
export type OtpAudience = 'operator' | 'customer';
export interface OtpContext { audience: OtpAudience; anchorName?: string }

export async function sendOtpEmail(to: string, code: string, ctx: OtpContext = { audience: 'operator' }) {
  const anchor = ctx.anchorName?.trim();
  let subject: string;
  let heading: string;
  let lead: string;

  if (ctx.audience === 'operator') {
    subject = `${code} — sign in to your NordStern console`;
    heading = 'Sign in to your operator console';
    lead = 'Use this one-time code to sign in to your NordStern operator console, where you manage your anchor’s treasury, pricing, and compliance.';
  } else if (anchor) {
    subject = `${code} — sign in to ${anchor}`;
    heading = `Sign in to ${anchor}`;
    lead = `Use this one-time code to sign in to your <b>${anchor}</b> account and buy or sell.`;
  } else {
    subject = `${code} is your sign-in code`;
    heading = 'Sign in to your account';
    lead = 'Use this one-time code to sign in and continue buying or selling.';
  }

  await deliver(to, subject, layout({
    heading,
    body: `<p style="margin:0 0 14px">${lead}</p>${codeBlock(code)}`,
    footnote: 'This code expires in 10 minutes. If you didn’t request it, you can safely ignore this email.',
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
