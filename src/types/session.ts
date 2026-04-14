export interface SessionPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  panNumber?: string;
  panName?: string;
}

export interface SessionData {
  businessName: string;
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  directors: SessionPerson[];
  beneficialOwners: SessionPerson[];
  representative?: SessionPerson;
}
