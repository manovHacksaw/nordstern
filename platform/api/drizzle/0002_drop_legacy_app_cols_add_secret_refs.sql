CREATE TABLE "secret_refs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"anchor_id" uuid,
	"slug" varchar(100) NOT NULL,
	"provider" varchar(40) NOT NULL,
	"secret_provider" varchar(20) NOT NULL,
	"secret_path" varchar(255) NOT NULL,
	"key_names" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_rotated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "anchors" ADD COLUMN "branding" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "secret_refs" ADD CONSTRAINT "secret_refs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secret_refs" ADD CONSTRAINT "secret_refs_anchor_id_anchors_id_fk" FOREIGN KEY ("anchor_id") REFERENCES "public"."anchors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "secret_refs_slug_provider_uq" ON "secret_refs" USING btree ("slug","provider");--> statement-breakpoint
CREATE INDEX "secret_refs_org_idx" ON "secret_refs" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "stellar_cfg";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "payment_rails";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "compliance";