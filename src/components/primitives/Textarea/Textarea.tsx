import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur'> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string | null;
  minChars?: number;
}

export function Textarea({
  value,
  onChange,
  onBlur,
  error,
  minChars,
  className,
  ...rest
}: TextareaProps) {
  const classes = [styles.textarea, error ? styles.hasError : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  const isCountOk = minChars ? value.trim().length >= minChars : false;

  return (
    <div className={styles.wrapper}>
      <textarea
        className={classes}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        {...rest}
      />
      {minChars && (
        <span className={[styles.charCount, isCountOk ? styles.charCountOk : ''].filter(Boolean).join(' ')}>
          {value.trim().length}/{minChars}
        </span>
      )}
    </div>
  );
}
