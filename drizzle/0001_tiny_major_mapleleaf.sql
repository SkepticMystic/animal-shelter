ALTER TABLE "animal_events" DROP CONSTRAINT "animal_events_administered_by_member_id_member_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider_id" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."provider_id";--> statement-breakpoint
CREATE TYPE "public"."provider_id" AS ENUM('credential', 'google');--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider_id" SET DATA TYPE "public"."provider_id" USING "provider_id"::"public"."provider_id";--> statement-breakpoint
ALTER TABLE "animal_events" ALTER COLUMN "administered_by_member_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "animal_events" ALTER COLUMN "timestamp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "animal_events" ADD COLUMN "administered_by_name" varchar(255);--> statement-breakpoint
ALTER TABLE "animal" ADD COLUMN "microchip_number" varchar(63);--> statement-breakpoint
ALTER TABLE "animal" ADD COLUMN "breed" varchar(255);--> statement-breakpoint
ALTER TABLE "animal_events" ADD CONSTRAINT "animal_events_administered_by_member_id_member_id_fk" FOREIGN KEY ("administered_by_member_id") REFERENCES "public"."member"("id") ON DELETE set null ON UPDATE no action;