export type InstitutionType =
  | "hospital"
  | "clinical-lab"
  | "pathology-center"
  | "microbiology-center"
  | "blood-bank"
  | "other";

export type LeadStatus = "new" | "contacted" | "scheduled" | "completed";

export type UserRole = "super_admin" | "sales_admin" | "lab_staff" | "pathologist";

export type UserStatus = "active" | "inactive";

export interface DemoRequestInput {
  name: string;
  institution: string;
  jobTitle: string;
  email: string;
  phone: string;
  institutionType: InstitutionType;
  notes?: string;
}

export interface LeadNoteRecord {
  id: string;
  leadId: string;
  authorId?: string | null;
  authorName?: string | null;
  content: string;
  createdAt: string;
}

export interface DemoRequestRecord extends DemoRequestInput {
  id: string;
  createdAt: string;
  status: LeadStatus;
  notesHistory?: LeadNoteRecord[];
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AuthSessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuditLogRecord {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  entity: string;
  recordId?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface LeadFilterQuery {
  status?: LeadStatus | "all";
  institutionType?: InstitutionType | "all";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ModuleItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  description: string;
  iconName: string;
  keyFeatures: string[];
  clinicalBenefits: string[];
  targetDepartment: string;
}

export interface SolutionItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  targetAudience: string;
  shortDesc: string;
  description: string;
  iconName: string;
  challenges: string[];
  solutionHighlights: string[];
  includedModules: string[];
}

export interface IntegrationItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  description: string;
  iconName: string;
  protocols: string[];
  highlights: string[];
  capabilities: string[];
}

export interface ComparisonItem {
  id: number;
  conventional: {
    title: string;
    description: string;
  };
  diagnova: {
    title: string;
    description: string;
  };
  impactMetric?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  details?: string[];
}

export interface NovaAICapability {
  title: string;
  description: string;
  exampleInput?: string;
  exampleOutput?: string;
}

// ==========================================
// TIPE DATA LIS CORE PRE-ANALITIK
// ==========================================

export type OrderPriority = "routine" | "cito" | "urgent";

export type OrderStatus =
  | "ordered"
  | "specimen_received"
  | "processing"
  | "partially_validated"
  | "completed"
  | "cancelled";

export type SpecimenStatus =
  | "collected"
  | "received_in_lab"
  | "processing"
  | "rejected"
  | "archived";

export type SpecimenType =
  | "whole_blood"
  | "serum"
  | "plasma"
  | "urine"
  | "csf"
  | "stool"
  | "swab"
  | "other";

export type TubeColor =
  | "lavender_edta"
  | "red_plain"
  | "yellow_sst"
  | "light_blue_citrate"
  | "gray_fluoride"
  | "green_heparin"
  | "urine_container"
  | "other";

export type PatientSex = "male" | "female";

export interface PatientRecord {
  id: string;
  mrn: string;
  nationalId?: string | null;
  name: string;
  birthDate: string;
  sex: PatientSex;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
}

export interface PhysicianRecord {
  id: string;
  externalCode?: string | null;
  name: string;
  specialization?: string | null;
  department?: string | null;
}

export interface TestCatalogRecord {
  id: string;
  code: string;
  name: string;
  category: string;
  specimenType: SpecimenType;
  tubeColor: TubeColor;
  unit?: string | null;
  tatMinutes: number;
  isActive: boolean;
}

export interface SpecimenRecord {
  id: string;
  barcodeNumber: string;
  orderId: string;
  specimenType: SpecimenType;
  tubeColor: TubeColor;
  volume?: string | null;
  collectedAt?: string | null;
  receivedAt?: string | null;
  status: SpecimenStatus;
  rejectionReason?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  receivedBy?: string | null;
  createdAt: string;
}

export interface LabOrderItemRecord {
  id: string;
  testCatalogId: string;
  testCatalog: TestCatalogRecord;
}

export interface LabOrderRecord {
  id: string;
  orderNumber: string;
  patientId: string;
  patient: PatientRecord;
  physicianId?: string | null;
  physician?: PhysicianRecord | null;
  sourceLocation: string;
  priority: OrderPriority;
  clinicalNotes?: string | null;
  status: OrderStatus;
  orderedAt: string;
  items: LabOrderItemRecord[];
  specimens: SpecimenRecord[];
  createdAt: string;
}

