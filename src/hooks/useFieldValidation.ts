import { useState, useCallback } from 'react';
import { useKycContext } from '../context/KycContext';

/**
 * Per-field validation hook.
 * - Shows error only after first blur (touched state)
 * - Validates on every change after touched
 */
export function useFieldValidation(
  fieldPath: string,
  validator: (value: string) => string | null
) {
  const { dispatch } = useKycContext();
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (value: string) => {
      const err = validator(value);
      setError(err);
      if (err) {
        dispatch({ type: 'SET_ERROR', path: fieldPath, message: err });
      } else {
        dispatch({ type: 'CLEAR_ERROR', path: fieldPath });
      }
      return err;
    },
    [validator, fieldPath, dispatch]
  );

  const touch = useCallback(
    (value: string) => {
      setTouched(true);
      validate(value);
    },
    [validate]
  );

  const onChange = useCallback(
    (value: string) => {
      if (touched) validate(value);
    },
    [touched, validate]
  );

  return {
    error: touched ? error : null,
    validate,
    touch,
    onChange,
    touched,
  };
}
