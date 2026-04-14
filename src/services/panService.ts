import { mockDelay } from './mockDelay';
import type { ApiResult, PanInfo } from './types';

// Mock database keyed by PAN
const PAN_DB: Record<string, PanInfo> = {
  AABCT1332L: {
    panNumber: 'AABCT1332L',
    legalName: 'TATA CONSULTANCY SERVICES LIMITED',
    panHolderType: 'COMPANY',
    cin: 'L22210MH1995PLC084781',
    companyType: 'Public Limited',
    incorporationDate: '1995-01-19',
    address: {
      line1: '9th Floor, Nirmal Building',
      line2: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400021',
    },
  },
  AAACR5055K: {
    panNumber: 'AAACR5055K',
    legalName: 'RELIANCE INDUSTRIES LIMITED',
    panHolderType: 'COMPANY',
    cin: 'L17110MH1973PLC019786',
    companyType: 'Public Limited',
    incorporationDate: '1973-05-08',
    address: {
      line1: '3rd Floor, Maker Chambers IV',
      line2: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400021',
    },
  },
  AAECI7890K: {
    panNumber: 'AAECI7890K',
    legalName: 'INFOSYS LIMITED',
    panHolderType: 'COMPANY',
    cin: 'L85110KA1981PLC013115',
    companyType: 'Public Limited',
    incorporationDate: '1981-07-02',
    address: {
      line1: 'Electronics City, Hosur Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560100',
    },
  },
  AAFCX1234M: {
    panNumber: 'AAFCX1234M',
    legalName: 'XFLOW TECHNOLOGIES PRIVATE LIMITED',
    panHolderType: 'COMPANY',
    cin: 'U72900KA2020PTC134567',
    companyType: 'Private Limited',
    incorporationDate: '2020-03-15',
    address: {
      line1: '12th Floor, Prestige Tech Tower',
      line2: 'Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560103',
    },
  },
};

export async function getPanInfo(pan: string): Promise<ApiResult<PanInfo>> {
  await mockDelay();

  const normalized = pan.toUpperCase().trim();
  const record = PAN_DB[normalized];

  if (!record) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `No records found for PAN ${normalized}. Please verify the PAN number or enter details manually.`,
      },
    };
  }

  return {
    success: true,
    response: {
      data: record,
      source: 'ITD',
      fetchedAt: new Date().toISOString(),
    },
  };
}
