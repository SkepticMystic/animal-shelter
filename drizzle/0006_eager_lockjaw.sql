ALTER TABLE "animal_events" ALTER COLUMN "notes" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "animal_events" ALTER COLUMN "notes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "animal" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "animal" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shelter" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shelter" ALTER COLUMN "description" DROP NOT NULL;