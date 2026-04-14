import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'info' | 'success' | 'neutral' | 'warning' | 'error' | 'mca' | 'gstn' | 'itd';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'info', children, className }: BadgeProps) {
  const classes = [styles.badge, styles[variant], className ?? ''].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}

/** Convenience: badge for a given API source string */
export function SourceBadge({ source }: { source: string }) {
  const variantMap: Record<string, BadgeVariant> = {
    MCA: 'mca',
    GSTN: 'gstn',
    ITD: 'itd',
  };
  const labelMap: Record<string, string> = {
    MCA: 'Fetched from MCA',
    GSTN: 'Fetched from GSTN',
    ITD: 'Verified via ITD',
  };
  const variant = variantMap[source] ?? 'neutral';
  const label = labelMap[source] ?? `Fetched from ${source}`;
  return <Badge variant={variant}>{label}</Badge>;
}
