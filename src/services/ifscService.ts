import { mockDelay } from './mockDelay';
import type { ApiResult, IfscInfo } from './types';

const IFSC_DB: Record<string, IfscInfo> = {
  HDFC0001234: { ifsc: 'HDFC0001234', bankName: 'HDFC Bank', branchName: 'Nariman Point', city: 'Mumbai', state: 'Maharashtra' },
  ICIC0001234: { ifsc: 'ICIC0001234', bankName: 'ICICI Bank', branchName: 'Connaught Place', city: 'New Delhi', state: 'Delhi' },
  SBIN0001234: { ifsc: 'SBIN0001234', bankName: 'State Bank of India', branchName: 'MG Road', city: 'Bengaluru', state: 'Karnataka' },
  KOTAK0001234: { ifsc: 'KOTAK0001234', bankName: 'Kotak Mahindra Bank', branchName: 'Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra' },
  AXIS0001234: { ifsc: 'AXIS0001234', bankName: 'Axis Bank', branchName: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka' },
  YESB0001234: { ifsc: 'YESB0001234', bankName: 'Yes Bank', branchName: 'Lower Parel', city: 'Mumbai', state: 'Maharashtra' },
  KKBK0001234: { ifsc: 'KKBK0001234', bankName: 'Kotak Mahindra Bank', branchName: 'Koramangala', city: 'Bengaluru', state: 'Karnataka' },
  RATN0000001: { ifsc: 'RATN0000001', bankName: 'RBL Bank', branchName: 'Fort', city: 'Mumbai', state: 'Maharashtra' },
};

export async function lookupIfsc(ifsc: string): Promise<ApiResult<IfscInfo>> {
  await mockDelay(400 + Math.random() * 400);
  const record = IFSC_DB[ifsc.toUpperCase().trim()];
  if (!record) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `IFSC code ${ifsc} not found. Please verify or enter bank details manually.` },
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
