import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string | null;
  trailing?: ReactNode;
  transform?: 'uppercase' | 'lowercase';
  mono?: boolean;
}

export function Input({
  value,
  onChange,
  onBlur,
  error,
  trailing,
  transform,
  mono = false,
  className,
  disabled,
  ...rest
}: InputProps) {
  const inputClasses = [
    styles.input,
    error ? styles.hasError : '',
    trailing ? styles.hasTrailing : '',
    mono ? styles.mono : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value;
    if (transform === 'uppercase') v = v.toUpperCase();
    if (transform === 'lowercase') v = v.toLowerCase();
    onChange(v);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    onBlur?.(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <input
        className={inputClasses}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </div>
  );
}
