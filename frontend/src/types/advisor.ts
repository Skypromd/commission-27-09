export interface Advisor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: AdvisorStatus;
  commissionRate: number;
  specializations: Specialization[];
  address?: Address;
  dateOfBirth?: string;
  nationalInsuranceNumber?: string;
  bankDetails?: BankDetails;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;

  // Computed fields
  fullName: string;
  totalCommissions?: number;
  activeClients?: number;
  completedSales?: number;
}

export interface CreateAdvisorData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  commissionRate: number;
  specializations: Specialization[];
  address?: Partial<Address>;
  dateOfBirth?: string;
  nationalInsuranceNumber?: string;
  bankDetails?: Partial<BankDetails>;
}

export interface UpdateAdvisorData extends Partial<CreateAdvisorData> {
  status?: AdvisorStatus;
}

export type AdvisorStatus = 
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending_approval'
  | 'archived';

export type Specialization =
  | 'mortgages'
  | 'life_insurance'
  | 'critical_illness'
  | 'income_protection'
  | 'building_insurance'
  | 'contents_insurance'
  | 'business_insurance'
  | 'pension_planning'
  | 'investments';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
}

export interface Document {
  id: number;
  type: DocumentType;
  filename: string;
  url: string;
  uploadedAt: string;
  expiresAt?: string;
}

export type DocumentType =
  | 'id_proof'
  | 'address_proof'
  | 'qualification'
  | 'insurance_certificate'
  | 'bank_statement'
  | 'contract'
  | 'other';

export interface AdvisorFilters {
  status?: AdvisorStatus;
  specialization?: Specialization;
  search?: string;
  minCommissionRate?: number;
  maxCommissionRate?: number;
  createdFrom?: string;
  createdTo?: string;
}

export interface AdvisorStats {
  totalCommissions: number;
  monthlyCommissions: number;
  totalClients: number;
  activeClients: number;
  completedSales: number;
  pendingSales: number;
  averageSaleValue: number;
  conversionRate: number;
}
