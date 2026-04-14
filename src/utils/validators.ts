import type { KycFormState, ValidationErrors } from '../types/kyc';

// ---- Format Validators (pure, return error string or null) ----

export function validatePan(value: string): string | null {
  if (!value.trim()) return 'PAN is required';
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()))
    return 'Invalid PAN format — expected ABCDE1234F';
  return null;
}

export function validateGstin(value: string): string | null {
  if (!value.trim()) return 'GSTIN is required';
  if (
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      value.toUpperCase()
    )
  )
    return 'Invalid GSTIN — expected format: 27ABCDE1234F1Z5';
  return null;
}

export function validateCin(value: string): string | null {
  if (!value.trim()) return 'CIN is required';
  if (!/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value.toUpperCase()))
    return 'Invalid CIN — expected format: L12345AB2004ABC123456';
  return null;
}

export function validateIfsc(value: string): string | null {
  if (!value.trim()) return 'IFSC code is required';
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase()))
    return 'Invalid IFSC — expected format: HDFC0001234';
  return null;
}

export function validateUrl(value: string): string | null {
  if (!value.trim()) return null; // URL is optional
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    if (!url.hostname.includes('.')) return 'Enter a valid URL (e.g. https://acme.com)';
    return null;
  } catch {
    return 'Enter a valid URL (e.g. https://acme.com)';
  }
}

export function checkUrlMatchesBusiness(url: string, businessName: string): boolean {
  if (!url || !businessName) return true;
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const host = new URL(normalizedUrl).hostname.replace(/^www\./, '');
    const domainCore = host.split('.')[0].toLowerCase();
    const nameTokens = businessName.toLowerCase().split(/[\s_\-]+/);
    return nameTokens.some((t) => t.length > 3 && domainCore.includes(t));
  } catch {
    return true; // Don't warn on unparseable URLs
  }
}

export function validateAccountNumber(value: string): string | null {
  if (!value.trim()) return 'Account number is required';
  if (!/^\d{9,18}$/.test(value)) return 'Account number must be 9–18 digits';
  return null;
}

export function validateAccountMatch(a: string, b: string): string | null {
  if (!b.trim()) return 'Please confirm your account number';
  if (a !== b) return 'Account numbers do not match';
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`;
  return null;
}

export function validateMinLength(value: string, min: number, label: string): string | null {
  if (value.trim().length < min) return `${label} must be at least ${min} characters`;
  return null;
}

// ---- Step Validity Gating ----

export function isStep1Valid(state: KycFormState, _errors: ValidationErrors): boolean {
  const { step1 } = state;
  if (step1.businessDescription.trim().length < 50) return false;
  if (step1.currencies.length === 0) return false;
  if (step1.onlinePresence.website && validateUrl(step1.onlinePresence.website)) return false;
  return true;
}

export function isStep2Valid(state: KycFormState, _errors: ValidationErrors): boolean {
  const { step2 } = state;
  const { panDocument, businessId } = step2;

  // PAN document: must have text entry or upload
  const panOk =
    panDocument.mode === 'upload'
      ? panDocument.file !== null
      : validatePan(panDocument.panNumber) === null && panDocument.panName.trim().length > 0;

  if (!panOk) return false;

  // Business ID: type must be chosen
  if (!businessId.type) return false;

  if (businessId.mode === 'upload') {
    if (!businessId.file) return false;
  } else {
    if (businessId.type === 'GSTIN' && validateGstin(businessId.value) !== null) return false;
    if (businessId.type === 'CIN' && validateCin(businessId.value) !== null) return false;
    if (businessId.type === 'BUSINESS_PAN' && validatePan(businessId.value) !== null) return false;
  }

  return true;
}

export function isStep3Valid(state: KycFormState, _errors: ValidationErrors): boolean {
  const { step3 } = state;
  if (step3.directors.length < 2) return false;
  for (const d of step3.directors) {
    const docOk =
      d.document.mode === 'upload'
        ? d.document.file !== null
        : validatePan(d.document.panNumber) === null;
    if (!docOk) return false;
    if (!d.name.trim()) return false;
  }
  return true;
}

export function isStep4Valid(state: KycFormState, _errors: ValidationErrors): boolean {
  const { step4 } = state;
  if (!step4.accountHolderName.trim()) return false;
  if (validateAccountNumber(step4.accountNumber) !== null) return false;
  if (validateAccountMatch(step4.accountNumber, step4.accountNumberConfirm) !== null) return false;
  if (validateIfsc(step4.ifscCode) !== null) return false;
  if (!step4.bankName.trim()) return false;
  return true;
}

export function isStepValid(
  step: number,
  formState: KycFormState,
  errors: ValidationErrors
): boolean {
  switch (step) {
    case 1: return isStep1Valid(formState, errors);
    case 2: return isStep2Valid(formState, errors);
    case 3: return isStep3Valid(formState, errors);
    case 4: return isStep4Valid(formState, errors);
    case 5: return formState.declaration;
    default: return false;
  }
}
