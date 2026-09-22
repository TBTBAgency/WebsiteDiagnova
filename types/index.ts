export type InstitutionType =
  | "hospital"
  | "clinical-lab"
  | "pathology-center"
  | "microbiology-center"
  | "blood-bank"
  | "other";

export interface DemoRequestInput {
  name: string;
  institution: string;
  jobTitle: string;
  email: string;
  phone: string;
  institutionType: InstitutionType;
  notes?: string;
}

export interface DemoRequestRecord extends DemoRequestInput {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "scheduled" | "completed";
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
