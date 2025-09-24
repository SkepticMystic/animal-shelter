CREATE TYPE "public"."animal_status" AS ENUM('available', 'fostered', 'adopted', 'deceased');--> statement-breakpoint
ALTER TABLE "animal" ADD COLUMN "sterilised" boolean;--> statement-breakpoint
ALTER TABLE "animal" ADD COLUMN "status" "animal_status" DEFAULT 'available' NOT NULL;