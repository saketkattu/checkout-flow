import { mockDelay } from './mockDelay';
import type { ApiResult, PanVerifyResult } from './types';

const PAN_VERIFY_DB: Record<string, PanVerifyResult> = {
  ABCPK9234F: { panNumber: 'ABCPK9234F', nameOnPan: 'ARJUN KRISHNASWAMY', isValid: true },
  ABCPV1234G: { panNumber: 'ABCPV1234G', nameOnPan: 'PRIYA VENKATARAMAN', isValid: true },
  AABPA1234B: { panNumber: 'AABPA1234B', nameOnPan: 'MUKESH DHIRUBHAI AMBANI', isValid: true },
  ABCDE1234F: { panNumber: 'ABCDE1234F', nameOnPan: 'DEMO USER', isValid: true },
  TESTP1234A: { panNumber: 'TESTP1234A', nameOnPan: 'TEST PERSON', isValid: true },
};

export async function verifyIndividualPan(pan: string): Promise<ApiResult<PanVerifyResult>> {
  await mockDelay(600 + Math.random() * 400);
  const record = PAN_VERIFY_DB[pan.toUpperCase().trim()];
  if (!record) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `Unable to verify PAN ${pan}. Please check the number or upload the document.` },
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
