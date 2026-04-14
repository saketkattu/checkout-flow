export type BusinessIdType = 'GSTIN' | 'BUSINESS_PAN' | 'CIN';
export type DocumentInputMode = 'text' | 'upload';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'INR' | 'AUD' | 'CAD';

export interface OnlinePresence {
  website: string;
  socialUrls: string[];
}

export interface Step1State {
  businessDescription: string;
  onlinePresence: OnlinePresence;
  currencies: CurrencyCode[];
}

export interface PanDocument {
  mode: DocumentInputMode;
  panNumber: string;
  panName: string;
  file: File | null;
}

export interface BusinessId {
  type: BusinessIdType | null;
  value: string;
  mode: DocumentInputMode;
  file: File | null;
}

export interface Step2State {
  panDocument: PanDocument;
  businessId: BusinessId;
}

export interface PersonDocument {
  mode: DocumentInputMode;
  panNumber: string;
  panName: string;
  file: File | null;
}

export interface KycPerson {
  id: string;
  name: string;
  din?: string;
  designation?: string;
  ownershipPercent?: number;
  nationality?: string;
  relationship?: 'Director' | 'Employee' | 'Authorized Signatory';
  isPreFilled: boolean;
  apiSource?: 'mca' | 'gstn' | 'session';
  document: PersonDocument;
  isExpanded: boolean;
}

export interface Step3State {
  directors: KycPerson[];
  beneficialOwners: KycPerson[];
  representative: KycPerson | null;
}

export interface Step4State {
  accountHolderName: string;
  accountNumber: string;
  accountNumberConfirm: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface KycFormState {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
  step4: Step4State;
  declaration: boolean;
}

export interface ValidationErrors {
  [fieldPath: string]: string;
}
