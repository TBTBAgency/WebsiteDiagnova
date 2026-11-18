-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('super_admin', 'sales_admin', 'lab_staff', 'pathologist');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'sales_admin',
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notes" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "author_id" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "record_id" VARCHAR(100),
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" VARCHAR(50),
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "lead_notes_lead_id_idx" ON "lead_notes"("lead_id");

-- CreateIndex
CREATE INDEX "lead_notes_author_id_idx" ON "lead_notes"("author_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_record_id_idx" ON "audit_logs"("entity", "record_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
