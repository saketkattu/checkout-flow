export type ApiSource = 'MCA' | 'GSTN' | 'ITD' | 'MANUAL';

export interface ApiResponse<T> {
  data: T;
  source: ApiSource;
  fetchedAt: string;
}

export interface ApiError {
  code: 'NOT_FOUND' | 'INVALID_INPUT' | 'SERVICE_UNAVAILABLE';
  message: string;
}

export type ApiResult<T> =
  | { success: true; response: ApiResponse<T> }
  | { success: false; error: ApiError };

// PAN Info (from Income Tax Department via PAN → Company lookup)
export interface PanInfo {
  panNumber: string;
  legalName: string;
  panHolderType: 'INDIVIDUAL' | 'COMPANY' | 'FIRM' | 'TRUST';
  cin?: string;
  address?: PanAddress;
  incorporationDate?: string;
  companyType?: string;
}

export interface PanAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
}

// GST Info
export interface GstInfo {
  gstin: string;
  legalName: string;
  tradeName: string;
  registrationDate: string;
  businessType: string;
  address: PanAddress;
  hsnCodes?: string[];
}

// CIN / Company Info
export interface CinInfo {
  cin: string;
  legalName: string;
  companyType: string;
  incorporationDate: string;
  registeredAddress: PanAddress;
  status: 'ACTIVE' | 'STRUCK_OFF' | 'DISSOLVED';
}

// MCA Director
export interface Director {
  name: string;
  din: string;
  designation: string;
  appointedDate: string;
  panNumber?: string;
}

// UBO Entry
export interface UboEntry {
  name: string;
  ownershipPercent: number;
  nationality: string;
  panNumber?: string;
}

// Individual PAN Verification
export interface PanVerifyResult {
  panNumber: string;
  nameOnPan: string;
  isValid: boolean;
}

// IFSC Lookup
export interface IfscInfo {
  ifsc: string;
  bankName: string;
  branchName: string;
  city: string;
  state: string;
}
