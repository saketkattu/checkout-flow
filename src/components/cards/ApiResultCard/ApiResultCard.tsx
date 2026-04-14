import { useState } from 'react';
import styles from './ApiResultCard.module.css';
import { Badge, type BadgeVariant } from '../../primitives/Badge/Badge';
import { formatDate } from '../../../utils/formatters';

interface ApiResultField {
  label: string;
  value: string;
  full?: boolean;
}

interface ApiResultCardProps {
  title: string;
  source: string;
  fetchedAt: string;
  fields: ApiResultField[];
  defaultOpen?: boolean;
}

function sourceVariant(source: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = { MCA: 'mca', GSTN: 'gstn', ITD: 'itd' };
  return map[source] ?? 'neutral';
}

function sourceLabel(source: string): string {
  const map: Record<string, string> = { MCA: 'Ministry of Corporate Affairs', GSTN: 'GSTN Portal', ITD: 'Income Tax Dept.' };
  return map[source] ?? source;
}

export function ApiResultCard({ title, source, fetchedAt, fields, defaultOpen = true }: ApiResultCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setIsOpen((o) => !o)}>
        <div className={styles.headerLeft}>
          <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <span className={styles.headerTitle}>{title}</span>
          <Badge variant={sourceVariant(source)}>{sourceLabel(source)}</Badge>
        </div>
        <svg
          className={[styles.chevron, isOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {isOpen && (
        <>
          <div className={styles.body}>
            {fields.map((f) => (
              <div key={f.label} className={[styles.field, f.full ? styles.fieldFull : ''].filter(Boolean).join(' ')}>
                <span className={styles.fieldLabel}>{f.label}</span>
                <span className={styles.fieldValue}>{f.value || '—'}</span>
              </div>
            ))}
          </div>
          <div className={styles.fetchedAt}>
            Fetched {formatDate(fetchedAt)} · Data sourced from {sourceLabel(source)}
          </div>
        </>
      )}
    </div>
  );
}
