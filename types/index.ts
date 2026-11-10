export type InstitutionType =
  | "hospital"
  | "clinical-lab"
  | "pathology-center"
  | "microbiology-center"
  | "blood-bank"
  | "other";

export type LeadStatus = number; // 1: Baru, 2: Dihubungi, 3: Jadwal Demo, 4: Selesai

export type LeadApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type UserRole = string;

export type UserStatus = number; // 1: Aktif, 0: Nonaktif

export interface RoleRecord {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
}

export interface DemoRequestInput {
  name: string;
  institution: string;
  jobTitle: string;
  email: string;
  phone: string;
  institutionType: InstitutionType;
  requestedDemoDate?: string | null;
  confirmedDemoDate?: string | null;
  demoDate?: string | null;
  notes?: string;
}

export interface DemoRequestRecord extends DemoRequestInput {
  id: string;
  userId?: string | null;
  user?: UserRecord | null;
  createdAt: string;
  status: number; // 1: Baru, 2: Dihubungi, 3: Jadwal Demo, 4: Selesai
  approvalStatus: LeadApprovalStatus;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectionReason?: string | null;
  demoDurationDays?: number;
  voucherCode?: string | null;
  voucherExpiry?: string | null;
  demoDate?: string | null;
  magicLinkUrl?: string | null;
  magicLinkExpiry?: string | null;
}

export interface DemoMagicLinkRecord {
  id: string;
  tokenHash: string;
  email: string;
  leadId: string;
  userId?: string | null;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  institution?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  role?: RoleRecord | string | null;
  status: number; // 1: Aktif, 0: Nonaktif
  demoDurationDays?: number | null;
  demoActivatedAt?: string | null;
  demoExpiresAt?: string | null;
  createdAt: string;
}

export interface AuthSessionPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  demoExpiresAt?: string;
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
  status?: number | "all";
  institutionType?: InstitutionType | "all";
  search?: string;
  startDate?: string;
  endDate?: string;
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
