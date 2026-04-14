import type { ReactNode } from 'react';
import styles from './FieldGroup.module.css';
import { Badge, type BadgeVariant } from '../Badge/Badge';
import { Spinner } from '../Spinner/Spinner';

interface FieldGroupProps {
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  prefillSource?: string | null;
  apiStatus?: 'loading' | 'success' | 'error' | null;
  apiStatusLabel?: string;
  children: ReactNode;
  className?: string;
}

function sourceVariant(source: string): BadgeVariant {
  if (source === 'MCA') return 'mca';
  if (source === 'GSTN') return 'gstn';
  if (source === 'ITD') return 'itd';
  return 'neutral';
}

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    MCA: 'Fetched from MCA',
    GSTN: 'Fetched from GSTN',
    ITD: 'Verified via ITD',
    session: 'Pre-filled from profile',
  };
  return map[source] ?? `Fetched from ${source}`;
}

export function FieldGroup({
  label,
  required,
  error,
  hint,
  prefillSource,
  apiStatus,
  apiStatusLabel,
  children,
  className,
}: FieldGroupProps) {
  return (
    <div className={[styles.group, className ?? ''].filter(Boolean).join(' ')}>
      <div className={styles.labelRow}>
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        {prefillSource && (
          <Badge variant={sourceVariant(prefillSource)}>{sourceLabel(prefillSource)}</Badge>
        )}
      </div>

      {children}

      {apiStatus === 'loading' && (
        <div className={[styles.apiStatus, styles.apiStatusLoading].join(' ')}>
          <Spinner size="sm" />
          <span>{apiStatusLabel ?? 'Verifying...'}</span>
        </div>
      )}

      {error && (
        <p className={styles.error}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
