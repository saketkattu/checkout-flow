import { mockDelay } from './mockDelay';
import type { ApiResult, GstInfo } from './types';

// Mock GSTIN DB keyed by GSTIN
const GST_DB: Record<string, GstInfo> = {
  '27AABCT1332L1ZV': {
    gstin: '27AABCT1332L1ZV',
    legalName: 'TATA CONSULTANCY SERVICES LIMITED',
    tradeName: 'TCS',
    registrationDate: '2017-07-01',
    businessType: 'Regular',
    address: {
      line1: '9th Floor, Nirmal Building',
      line2: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400021',
    },
    hsnCodes: ['998313', '998314', '998319'],
  },
  '27AAACR5055K1ZV': {
    gstin: '27AAACR5055K1ZV',
    legalName: 'RELIANCE INDUSTRIES LIMITED',
    tradeName: 'Reliance',
    registrationDate: '2017-07-01',
    businessType: 'Regular',
    address: {
      line1: '3rd Floor, Maker Chambers IV',
      line2: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400021',
    },
  },
  '29AAECI7890K1ZV': {
    gstin: '29AAECI7890K1ZV',
    legalName: 'INFOSYS LIMITED',
    tradeName: 'Infosys',
    registrationDate: '2017-07-01',
    businessType: 'Regular',
    address: {
      line1: 'Electronics City, Hosur Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560100',
    },
    hsnCodes: ['998313', '998319'],
  },
  '29AAFCX1234M1ZV': {
    gstin: '29AAFCX1234M1ZV',
    legalName: 'XFLOW TECHNOLOGIES PRIVATE LIMITED',
    tradeName: 'Xflow',
    registrationDate: '2020-06-01',
    businessType: 'Regular',
    address: {
      line1: '12th Floor, Prestige Tech Tower',
      line2: 'Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560103',
    },
    hsnCodes: ['998313', '997159'],
  },
};

// PAN → GSTIN index (simplified: one primary GSTIN per PAN)
const PAN_TO_GSTIN: Record<string, string> = {
  AABCT1332L: '27AABCT1332L1ZV',
  AAACR5055K: '27AAACR5055K1ZV',
  AAECI7890K: '29AAECI7890K1ZV',
  AAFCX1234M: '29AAFCX1234M1ZV',
};

export async function searchGstByPan(pan: string): Promise<ApiResult<GstInfo>> {
  await mockDelay();
  const gstin = PAN_TO_GSTIN[pan.toUpperCase().trim()];
  if (!gstin) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `No GST registration found for PAN ${pan}.` },
    };
  }
  return getGstDetails(gstin);
}

export async function getGstDetails(gstin: string): Promise<ApiResult<GstInfo>> {
  await mockDelay();
  const record = GST_DB[gstin.toUpperCase().trim()];
  if (!record) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `No GST registration found for GSTIN ${gstin}.` },
    };
  }
  return {
    success: true,
    response: {
      data: record,
      source: 'GSTN',
      fetchedAt: new Date().toISOString(),
    },
  };
}
