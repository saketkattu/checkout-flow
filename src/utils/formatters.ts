/** Force string to uppercase, stripping non-alphanumeric chars */
export function toUpperAlphaNum(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** Format GSTIN with spaces for readability: 27 ABCDE 1234F 1Z5 */
export function formatGstin(value: string): string {
  return value.toUpperCase().trim();
}

/** Format date from ISO to DD/MM/YYYY */
export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

/** Truncate file name for display */
export function truncateFileName(name: string, max = 30): string {
  if (name.length <= max) return name;
  const ext = name.split('.').pop() ?? '';
  return `${name.slice(0, max - ext.length - 4)}...${ext}`;
}

/** Format file size in KB/MB */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format ownership % */
export function formatOwnership(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

/** Format Indian address */
export function formatAddress(addr: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
}): string {
  const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.pin].filter(Boolean);
  return parts.join(', ');
}

/** Mask account number for display */
export function maskAccountNumber(num: string): string {
  if (num.length <= 4) return num;
  return `${'•'.repeat(num.length - 4)}${num.slice(-4)}`;
}
