-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "order_priority" AS ENUM ('routine', 'cito', 'urgent');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('ordered', 'specimen_received', 'processing', 'partially_validated', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "specimen_type" AS ENUM ('whole_blood', 'serum', 'plasma', 'urine', 'csf', 'stool', 'swab', 'other');

-- CreateEnum
CREATE TYPE "tube_color" AS ENUM ('lavender_edta', 'red_plain', 'yellow_sst', 'light_blue_citrate', 'gray_fluoride', 'green_heparin', 'urine_container', 'other');

-- CreateEnum
CREATE TYPE "specimen_status" AS ENUM ('collected', 'received_in_lab', 'processing', 'archived', 'rejected');

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "mrn" VARCHAR(50) NOT NULL,
    "national_id" VARCHAR(30),
    "name" VARCHAR(120) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "sex" "gender" NOT NULL,
    "phone" VARCHAR(30),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physicians" (
    "id" TEXT NOT NULL,
    "external_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_catalogs" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "specimen_type" "specimen_type" NOT NULL DEFAULT 'whole_blood',
    "tube_color" "tube_color" NOT NULL DEFAULT 'lavender_edta',
    "unit" VARCHAR(30),
    "tat_minutes" INTEGER NOT NULL DEFAULT 60,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_orders" (
    "id" TEXT NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "patient_id" TEXT NOT NULL,
    "physician_id" TEXT,
    "source_location" VARCHAR(100) NOT NULL,
    "priority" "order_priority" NOT NULL DEFAULT 'routine',
    "clinical_notes" TEXT,
    "status" "order_status" NOT NULL DEFAULT 'ordered',
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "test_catalog_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specimens" (
    "id" TEXT NOT NULL,
    "barcode_number" VARCHAR(50) NOT NULL,
    "order_id" TEXT NOT NULL,
    "specimen_type" "specimen_type" NOT NULL,
    "tube_color" "tube_color" NOT NULL,
    "volume" VARCHAR(30) DEFAULT '3.0 mL',
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMP(3),
    "status" "specimen_status" NOT NULL DEFAULT 'collected',
    "rejection_reason" TEXT,
    "rejected_by" VARCHAR(100),
    "rejected_at" TIMESTAMP(3),
    "received_by" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specimens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_mrn_key" ON "patients"("mrn");

-- CreateIndex
CREATE UNIQUE INDEX "patients_national_id_key" ON "patients"("national_id");

-- CreateIndex
CREATE INDEX "patients_name_idx" ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_mrn_idx" ON "patients"("mrn");

-- CreateIndex
CREATE UNIQUE INDEX "physicians_external_code_key" ON "physicians"("external_code");

-- CreateIndex
CREATE UNIQUE INDEX "test_catalogs_code_key" ON "test_catalogs"("code");

-- CreateIndex
CREATE INDEX "test_catalogs_category_idx" ON "test_catalogs"("category");

-- CreateIndex
CREATE UNIQUE INDEX "lab_orders_order_number_key" ON "lab_orders"("order_number");

-- CreateIndex
CREATE INDEX "lab_orders_order_number_idx" ON "lab_orders"("order_number");

-- CreateIndex
CREATE INDEX "lab_orders_patient_id_idx" ON "lab_orders"("patient_id");

-- CreateIndex
CREATE INDEX "lab_orders_status_idx" ON "lab_orders"("status");

-- CreateIndex
CREATE INDEX "lab_orders_priority_idx" ON "lab_orders"("priority");

-- CreateIndex
CREATE INDEX "lab_orders_ordered_at_idx" ON "lab_orders"("ordered_at");

-- CreateIndex
CREATE INDEX "lab_order_items_order_id_idx" ON "lab_order_items"("order_id");

-- CreateIndex
CREATE INDEX "lab_order_items_test_catalog_id_idx" ON "lab_order_items"("test_catalog_id");

-- CreateIndex
CREATE UNIQUE INDEX "specimens_barcode_number_key" ON "specimens"("barcode_number");

-- CreateIndex
CREATE INDEX "specimens_barcode_number_idx" ON "specimens"("barcode_number");

-- CreateIndex
CREATE INDEX "specimens_order_id_idx" ON "specimens"("order_id");

-- CreateIndex
CREATE INDEX "specimens_status_idx" ON "specimens"("status");

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_orders" ADD CONSTRAINT "lab_orders_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "physicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_order_items" ADD CONSTRAINT "lab_order_items_test_catalog_id_fkey" FOREIGN KEY ("test_catalog_id") REFERENCES "test_catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specimens" ADD CONSTRAINT "specimens_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "lab_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
