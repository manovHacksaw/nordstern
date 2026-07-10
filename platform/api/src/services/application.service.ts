import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, anchorInvitations } from '../db/schema.js';
import { applicationsRepo } from '../repositories/applications.repo.js';
import { anchorInvitationsRepo } from '../repositories/anchorInvitations.repo.js';
import { badRequest } from '../lib/errors.js';
import { env } from '../config/env.js';
import {
  sendApplicationReceivedEmail,
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
} from '../lib/mailer/index.js';

// Pull the founder-facing email + business name off the submitted profile.
function contactOf(profile: any): { email?: string; name: string } {
  return { email: profile?.businessEmail, name: profile?.legalEntityName ?? '' };
}

export const applicationService = {
  // Is this email already a founder on the platform? True if it's a registered user OR already
  // holds an anchor invitation (the sources that make a later approve collide on the unique
  // invitation email). Used by the /register wizard to warn while typing. Case-insensitive.
  async emailInUse(email: string): Promise<boolean> {
    const e = email.trim().toLowerCase();
    if (!e) return false;
    const [user, invite] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.email, e) }),
      db.query.anchorInvitations.findFirst({ where: eq(anchorInvitations.email, e) }),
    ]);
    return Boolean(user || invite);
  },

  async submit(data: { profile: any; product: any }) {
    const app = await applicationsRepo.create(data);
    // Acknowledge receipt (fire-and-forget — never block submission on email).
    const { email, name } = contactOf(data.profile);
    if (email) void sendApplicationReceivedEmail(email, name);
    return app;
  },

  async approve(applicationId: string) {
    const app = await applicationsRepo.findById(applicationId);
    if (!app) throw badRequest('Application not found');
    if (app.status === 'approved') throw badRequest('Application already approved');

    // 1. Mark application approved
    const updatedApp = await applicationsRepo.updateStatus(applicationId, 'approved');

    // 2. Generate cryptographically secure invite code
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Invite code expires in 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 3. Persist invitation record
    const email = (app.profile as any)?.businessEmail || 'compliance@nordstern.live';
    const invitation = await anchorInvitationsRepo.create({
      applicationId: app.id,
      email,
      tokenHash,
      expiresAt
    });

    // 4. Email the founder the one-time redeem link that kicks off provisioning.
    const { name } = contactOf(app.profile);
    void sendApplicationApprovedEmail(email, name, `${env.CONSOLE_URL}/redeem?token=${rawToken}`);

    return {
      application: updatedApp,
      invitationId: invitation.id,
      email: invitation.email,
      rawToken // returned to be sent via email/UI
    };
  },

  async reject(applicationId: string) {
    const app = await applicationsRepo.findById(applicationId);
    if (!app) throw badRequest('Application not found');
    if (app.status === 'approved') throw badRequest('Cannot reject an already-approved application');
    const updated = await applicationsRepo.updateStatus(applicationId, 'rejected');
    const { email, name } = contactOf(app.profile);
    if (email) void sendApplicationRejectedEmail(email, name);
    return updated;
  },

  get: (id: string) => applicationsRepo.findById(id),
  list: () => applicationsRepo.list()
};
