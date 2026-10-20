-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('new', 'contacted', 'scheduled', 'completed');

-- CreateEnum
CREATE TYPE "institution_type" AS ENUM ('hospital', 'clinical-lab', 'pathology-center', 'microbiology-center', 'blood-bank', 'other');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "institution" VARCHAR(150) NOT NULL,
    "jobTitle" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "institution_type" "institution_type" NOT NULL DEFAULT 'hospital',
    "notes" TEXT,
    "status" "lead_status" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");
