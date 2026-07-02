import { relations, sql } from 'drizzle-orm';
import {
  pgTable, pgEnum, uuid, varchar, jsonb, timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

// ════════════════════════════════════════════════════════════════════════════
// NordStern Control Plane — schema (Phase 3)
//
// Tenancy: `organizations` is the tenant. Every tenant-owned row carries
// `organization_id`; the app's tenant guard scopes all queries by it.
// `users` are global identities (can belong to many orgs via `memberships`).
// ════════════════════════════════════════════════════════════════════════════

// ── Enums ───────────────────────────────────────────────────────────────────
export const membershipRole   = pgEnum('membership_role', ['owner', 'admin', 'member', 'billing']);
export const invitationStatus = pgEnum('invitation_status', ['pending', 'accepted', 'revoked', 'expired']);
export const organizationStatus = pgEnum('organization_status', ['active', 'suspended']);
export const userStatus        = pgEnum('user_status', ['active', 'suspended']);
export const apiKeyStatus      = pgEnum('api_key_status', ['active', 'revoked']);
export const anchorStatus      = pgEnum('anchor_status', ['draft', 'provisioning', 'active', 'error', 'suspended', 'removed']);
export const network           = pgEnum('network', ['testnet', 'mainnet']);

// Reusable timestamp columns.
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
};

// ── Identity ─────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),          // stored lower-cased
  fullName: varchar('full_name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  status: userStatus('status').default('active').notNull(),
  ...timestamps,
}, (t) => [uniqueIndex('users_email_uq').on(t.email)]);

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }), // active org context
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
  userAgent: varchar('user_agent', { length: 512 }),
  ip: varchar('ip', { length: 64 }),
  rotatedFrom: uuid('rotated_from'),                            // previous session in a rotation chain
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex('sessions_refresh_uq').on(t.refreshTokenHash),
  index('sessions_user_idx').on(t.userId),
]);

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('evt_token_uq').on(t.tokenHash), index('evt_user_idx').on(t.userId)]);

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('prt_token_uq').on(t.tokenHash), index('prt_user_idx').on(t.userId)]);

// ── Tenancy ──────────────────────────────────────────────────────────────────
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  website: varchar('website', { length: 255 }),
  country: varchar('country', { length: 100 }),
  teamSize: varchar('team_size', { length: 50 }),              // onboarding step 2
  primaryGoal: varchar('primary_goal', { length: 50 }),        // onboarding step 3
  status: organizationStatus('status').default('active').notNull(),
  ...timestamps,
}, (t) => [uniqueIndex('organizations_slug_uq').on(t.slug)]);

export const memberships = pgTable('memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: membershipRole('role').default('member').notNull(),
  ...timestamps,
}, (t) => [
  uniqueIndex('memberships_org_user_uq').on(t.organizationId, t.userId),
  index('memberships_user_idx').on(t.userId),
  index('memberships_org_idx').on(t.organizationId),
]);

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  role: membershipRole('role').default('member').notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  invitedByUserId: uuid('invited_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  status: invitationStatus('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  ...timestamps,
}, (t) => [
  uniqueIndex('invitations_token_uq').on(t.tokenHash),
  index('invitations_org_idx').on(t.organizationId),
  index('invitations_email_idx').on(t.email),
]);

// ── Platform resources ───────────────────────────────────────────────────────
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  network: network('network').default('testnet').notNull(),
  ...timestamps,
}, (t) => [
  uniqueIndex('workspaces_org_slug_uq').on(t.organizationId, t.slug),
  index('workspaces_org_idx').on(t.organizationId),
]);

// Placeholder for the future Data-Plane link. Enough to model the relationship;
// provisioning details land in a later phase.
export const anchors = pgTable('anchors', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  status: anchorStatus('status').default('draft').notNull(),
  network: network('network').default('testnet').notNull(),
  ...timestamps,
}, (t) => [
  uniqueIndex('anchors_org_slug_uq').on(t.organizationId, t.slug),
  index('anchors_org_idx').on(t.organizationId),
  index('anchors_ws_idx').on(t.workspaceId),
]);

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 32 }).notNull(),  // shown for identification
  keyHash: varchar('key_hash', { length: 255 }).notNull(),     // hash of the full secret
  last4: varchar('last4', { length: 8 }).notNull(),
  scopes: jsonb('scopes').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
  status: apiKeyStatus('status').default('active').notNull(),
  createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex('api_keys_hash_uq').on(t.keyHash),
  index('api_keys_org_idx').on(t.organizationId),
  index('api_keys_prefix_idx').on(t.keyPrefix),
]);

// Append-only. Written for every mutating action; org-scoped (nullable for
// account-level events like login before an org is selected).
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),        // e.g. 'user.login', 'org.member.invited'
  targetType: varchar('target_type', { length: 100 }),
  targetId: varchar('target_id', { length: 255 }),
  metadata: jsonb('metadata'),
  ip: varchar('ip', { length: 64 }),
  userAgent: varchar('user_agent', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('audit_logs_org_created_idx').on(t.organizationId, t.createdAt),
  index('audit_logs_actor_idx').on(t.actorUserId),
]);

// ── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  sessions: many(sessions),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  invitations: many(invitations),
  workspaces: many(workspaces),
  anchors: many(anchors),
  apiKeys: many(apiKeys),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  organization: one(organizations, { fields: [memberships.organizationId], references: [organizations.id] }),
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, { fields: [invitations.organizationId], references: [organizations.id] }),
  invitedBy: one(users, { fields: [invitations.invitedByUserId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  organization: one(organizations, { fields: [sessions.organizationId], references: [organizations.id] }),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  organization: one(organizations, { fields: [workspaces.organizationId], references: [organizations.id] }),
  anchors: many(anchors),
}));

export const anchorsRelations = relations(anchors, ({ one }) => ({
  organization: one(organizations, { fields: [anchors.organizationId], references: [organizations.id] }),
  workspace: one(workspaces, { fields: [anchors.workspaceId], references: [workspaces.id] }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  organization: one(organizations, { fields: [apiKeys.organizationId], references: [organizations.id] }),
  createdBy: one(users, { fields: [apiKeys.createdByUserId], references: [users.id] }),
}));
