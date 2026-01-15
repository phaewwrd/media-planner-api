CREATE TABLE "planner_options" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"step_id" varchar(20) NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"next_step_id" varchar(20),
	"metadata" jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "planner_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_name" varchar(100) NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"conditions" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"explanation" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "planner_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"answers" jsonb NOT NULL,
	"recommendation" jsonb,
	"total_budget" numeric(12, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "planner_steps" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"step_number" numeric(3, 1) NOT NULL,
	"question" text NOT NULL,
	"insight" text NOT NULL,
	"category" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ref_models" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"desc" text NOT NULL,
	"fb" integer NOT NULL,
	"gg" integer NOT NULL,
	"tt" integer NOT NULL,
	"insights" text NOT NULL,
	"script" text NOT NULL,
	"recs" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ref_questions" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"phase" text NOT NULL,
	"title" text NOT NULL,
	"desc" text NOT NULL,
	"hint" text NOT NULL,
	"options" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "planner_options" ADD CONSTRAINT "planner_options_step_id_planner_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."planner_steps"("id") ON DELETE cascade ON UPDATE no action;