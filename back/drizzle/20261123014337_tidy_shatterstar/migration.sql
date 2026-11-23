CREATE TABLE "game_table" (
	"id_game" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"id_reservations" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	"id_map" uuid NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"progress" real DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"status" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map_table" (
	"id_map" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"difficulty" integer NOT NULL,
	"max_score" real NOT NULL,
	"time_limit" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "puzzles_table" (
	"id_puzzles" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"id_map" uuid NOT NULL,
	"index1_4" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" varchar(255) NOT NULL,
	"solution" varchar(255) NOT NULL,
	"hint" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id_reservations" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"id_map" uuid NOT NULL,
	"id_user" uuid NOT NULL,
	"reserve_at" timestamp NOT NULL,
	"status" varchar(255) NOT NULL,
	"team" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text DEFAULT 'player'
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_id_reservations_reservations_id_reservations_fkey" FOREIGN KEY ("id_reservations") REFERENCES "reservations"("id_reservations");--> statement-breakpoint
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_id_user_user_id_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "game_table" ADD CONSTRAINT "game_table_id_map_map_table_id_map_fkey" FOREIGN KEY ("id_map") REFERENCES "map_table"("id_map");--> statement-breakpoint
ALTER TABLE "puzzles_table" ADD CONSTRAINT "puzzles_table_id_map_map_table_id_map_fkey" FOREIGN KEY ("id_map") REFERENCES "map_table"("id_map");--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_id_map_map_table_id_map_fkey" FOREIGN KEY ("id_map") REFERENCES "map_table"("id_map");--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_id_user_user_id_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;