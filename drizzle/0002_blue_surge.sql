CREATE TYPE "public"."microchip_lookup_aggregators" AS ENUM('findmychip');--> statement-breakpoint
CREATE TYPE "public"."microchip_lookup_databases" AS ENUM('agrichip', 'identipet', 'communipet', 'getmeknown', 'virbac', 'fivestarid');--> statement-breakpoint
CREATE TABLE "microchip_lookup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"aggregator_id" "microchip_lookup_aggregators",
	"database_id" "microchip_lookup_databases" NOT NULL,
	"microchip_number" varchar(63) NOT NULL,
	"data" jsonb NOT NULL,
	"response" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "microchip_lookup_microchip_number_database_id_idx" UNIQUE("microchip_number","database_id")
);
