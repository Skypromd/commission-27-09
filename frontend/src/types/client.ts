import { Address } from './advisor';

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  dateOfBirth: string;
  nationalInsuranceNumber?: string;
  status: ClientStatus;
  advisorId: number;
  address: Address;
  employmentDetails?: EmploymentDetails;
  financialDetails?: FinancialDetails;
  preferences?: ClientPreferences;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  advisor?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Computed fields
  fullName: string;
  age: number;
  totalPremiums?: number;
  activePolicies?: number;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  dateOfBirth: string;
  nationalInsuranceNumber?: string;
  advisorId: number;
  address: Partial<Address>;
  employmentDetails?: Partial<EmploymentDetails>;
  financialDetails?: Partial<FinancialDetails>;
  preferences?: Partial<ClientPreferences>;
  tags?: string[];
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: ClientStatus;
}

export type ClientStatus = 
  | 'active'
  | 'inactive'
  | 'prospect'
  | 'converted'
  | 'dormant'
  | 'archived';

export interface EmploymentDetails {
  employer: string;
  position: string;
  workAddress: Address;
  employmentType: EmploymentType;
  annualIncome: number;
  employmentStartDate: string;
  previousEmployment?: {
    employer: string;
    position: string;
    startDate: string;
    endDate: string;
  }[];
}

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'self_employed'
  | 'unemployed'
  | 'retired'
  | 'student';

export interface FinancialDetails {
  annualIncome: number;
  monthlyExpenses: number;
  existingMortgage?: number;
  otherDebts?: number;
  savingsAmount?: number;
  investmentsAmount?: number;
  dependents: number;
  creditScore?: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
    bankName: string;
  };
}

export interface ClientPreferences {
  preferredContactMethod: ContactMethod;
  preferredContactTime: ContactTime;
  communicationFrequency: CommunicationFrequency;
  riskTolerance: RiskTolerance;
  investmentGoals: InvestmentGoal[];
  marketingOptIn: boolean;
  languagePreference: string;
}

export type ContactMethod = 'email' | 'phone' | 'sms' | 'post';
export type ContactTime = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type CommunicationFrequency = 'weekly' | 'monthly' | 'quarterly' | 'as_needed';
export type RiskTolerance = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export type InvestmentGoal =
  | 'retirement_planning'
  | 'property_purchase'
  | 'education_funding'
  | 'emergency_fund'
  | 'wealth_building'
  | 'tax_planning'
  | 'estate_planning';

export interface ClientFilters {
  status?: ClientStatus;
  advisorId?: number;
  search?: string;
  ageFrom?: number;
  ageTo?: number;
  incomeFrom?: number;
  incomeTo?: number;
  tags?: string[];
  createdFrom?: string;
  createdTo?: string;
}

export interface ClientStats {
  totalPremiums: number;
  activePolicies: number;
  lifetimeValue: number;
  averageClaimAmount: number;
  satisfactionScore: number;
  engagementScore: number;
}
