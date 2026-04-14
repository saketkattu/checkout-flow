import type { SessionData } from '../types/session';

export const mockSession: SessionData = {
  businessName: 'Xflow Technologies',
  legalName: 'XFLOW TECHNOLOGIES PRIVATE LIMITED',
  contactEmail: 'finance@xflow.in',
  contactPhone: '+91 98765 43210',
  directors: [
    {
      id: 'dir-1',
      name: 'ARJUN KRISHNASWAMY',
      email: 'arjun@xflow.in',
      panNumber: 'ABCPK9234F',
      panName: 'ARJUN KRISHNASWAMY',
    },
    {
      id: 'dir-2',
      name: 'PRIYA VENKATARAMAN',
      email: 'priya@xflow.in',
      panNumber: 'ABCPV1234G',
      panName: 'PRIYA VENKATARAMAN',
    },
  ],
  beneficialOwners: [
    {
      id: 'bo-1',
      name: 'ARJUN KRISHNASWAMY',
    },
  ],
  representative: {
    id: 'rep-1',
    name: 'PRIYA VENKATARAMAN',
    email: 'priya@xflow.in',
  },
};
