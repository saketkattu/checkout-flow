import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  onDark?: boolean;
  className?: string;
}

export function Spinner({ size = 'default', onDark = false, className }: SpinnerProps) {
  const classes = [
    styles.spinner,
    size === 'sm' ? styles.sm : '',
    size === 'lg' ? styles.lg : '',
    onDark ? styles.onDark : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={classes} role="status" aria-label="Loading" />;
}
