import { mockDelay } from './mockDelay';
import type { ApiResult, UboEntry } from './types';

const UBO_DB: Record<string, UboEntry[]> = {
  L22210MH1995PLC084781: [
    { name: 'TATA SONS PRIVATE LIMITED', ownershipPercent: 72.19, nationality: 'Indian' },
  ],
  L17110MH1973PLC019786: [
    { name: 'MUKESH DHIRUBHAI AMBANI', ownershipPercent: 42.68, nationality: 'Indian', panNumber: 'AABPA1234B' },
  ],
  L85110KA1981PLC013115: [
    { name: 'NANDAN MANOHAR NILEKANI', ownershipPercent: 3.42, nationality: 'Indian' },
    { name: 'NARAYANA NILEKANI FAMILY TRUST', ownershipPercent: 7.12, nationality: 'Indian' },
  ],
  U72900KA2020PTC134567: [
    { name: 'ARJUN KRISHNASWAMY', ownershipPercent: 55.00, nationality: 'Indian', panNumber: 'ABCPK9234F' },
    { name: 'PRIYA VENKATARAMAN', ownershipPercent: 30.00, nationality: 'Indian', panNumber: 'ABCPV1234G' },
  ],
};

export async function getUbosByCin(cin: string): Promise<ApiResult<UboEntry[]>> {
  await mockDelay();
  const ubos = UBO_DB[cin.toUpperCase().trim()];
  if (!ubos) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `No UBO records found for CIN ${cin}.` },
    };
  }
  return {
    success: true,
    response: {
      data: ubos,
      source: 'MCA',
      fetchedAt: new Date().toISOString(),
    },
  };
}
