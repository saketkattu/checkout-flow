import { useCallback } from 'react';
import styles from './Step4BankDetails.module.css';
import { useKycContext } from '../../../context/KycContext';
import { useApiCall } from '../../../hooks/useApiCall';
import { FieldGroup } from '../../primitives/FieldGroup/FieldGroup';
import { Input } from '../../primitives/Input/Input';
import { Spinner } from '../../primitives/Spinner/Spinner';
import { ApiResultCard } from '../../cards/ApiResultCard/ApiResultCard';
import { lookupIfsc } from '../../../services/ifscService';
import { validateAccountNumber, validateAccountMatch, validateIfsc } from '../../../utils/validators';
import type { IfscInfo } from '../../../services/types';

export function Step4BankDetails() {
  const { state, dispatch } = useKycContext();
  const { step4 } = state.formState;

  const ifscApiFn = useCallback(() => lookupIfsc(step4.ifscCode), [step4.ifscCode]);
  const { trigger: lookupIfscCode, callState: ifscCall } = useApiCall<IfscInfo>(
    // Re-using panLookup slot for IFSC (demo); in production use a dedicated slot
    'panLookup' as keyof typeof state.apiState,
    ifscApiFn,
    (data) => {
      dispatch({ type: 'SET_STEP4_FIELD', field: 'bankName', value: data.bankName });
      dispatch({ type: 'SET_STEP4_FIELD', field: 'branchName', value: data.branchName });
    }
  );

  function set(field: keyof typeof step4, value: string) {
    dispatch({ type: 'SET_STEP4_FIELD', field, value });
  }

  function handleIfscBlur(value: string) {
    if (!validateIfsc(value)) lookupIfscCode();
  }

  const accountError = step4.accountNumber ? validateAccountNumber(step4.accountNumber) : null;
  const confirmError = step4.accountNumberConfirm
    ? validateAccountMatch(step4.accountNumber, step4.accountNumberConfirm)
    : null;
  const ifscError = step4.ifscCode ? validateIfsc(step4.ifscCode) : null;
  const ifscApiData = ifscCall.status === 'success' ? (ifscCall.data as IfscInfo | null) : null;

  return (
    <div className={styles.root}>
      <div>
        <h2 className={styles.sectionTitle}>Bank details</h2>
        <p className={styles.sectionSubtitle}>
          Add the bank account where you'll receive international payments.
        </p>
      </div>

      <div className={styles.fields}>
        <FieldGroup
          label="Account holder name"
          required
          prefillSource={step4.accountHolderName ? 'session' : undefined}
        >
          <Input
            value={step4.accountHolderName}
            onChange={(v) => set('accountHolderName', v)}
            placeholder="Legal business name"
          />
        </FieldGroup>

        <div className={styles.twoCol}>
          <FieldGroup label="Account number" required error={accountError}>
            <Input
              value={step4.accountNumber}
              onChange={(v) => set('accountNumber', v)}
              onBlur={(v) => set('accountNumber', v)}
              placeholder="Enter account number"
              type="password"
              maxLength={18}
            />
          </FieldGroup>

          <FieldGroup label="Confirm account number" required error={confirmError}>
            <Input
              value={step4.accountNumberConfirm}
              onChange={(v) => set('accountNumberConfirm', v)}
              onBlur={(v) => set('accountNumberConfirm', v)}
              placeholder="Re-enter account number"
              type="password"
              maxLength={18}
            />
          </FieldGroup>
        </div>

        <div className={styles.twoCol}>
          <FieldGroup
            label="IFSC code"
            required
            error={ifscError}
            apiStatus={ifscCall.status === 'loading' ? 'loading' : null}
            apiStatusLabel="Looking up bank details..."
          >
            <Input
              value={step4.ifscCode}
              onChange={(v) => set('ifscCode', v)}
              onBlur={handleIfscBlur}
              placeholder="HDFC0001234"
              transform="uppercase"
              maxLength={11}
              mono
              trailing={ifscCall.status === 'loading' ? <Spinner size="sm" /> : undefined}
            />
          </FieldGroup>

          <FieldGroup
            label="Bank name"
            required
            prefillSource={ifscApiData ? 'ITD' : undefined}
          >
            <Input
              value={step4.bankName}
              onChange={(v) => set('bankName', v)}
              placeholder="Auto-filled from IFSC"
              disabled={ifscCall.status === 'loading'}
            />
          </FieldGroup>
        </div>

        {ifscApiData && (
          <ApiResultCard
            title="Bank Lookup Result"
            source="ITD"
            fetchedAt={ifscCall.fetchedAt ?? new Date().toISOString()}
            fields={[
              { label: 'Bank', value: ifscApiData.bankName },
              { label: 'Branch', value: ifscApiData.branchName },
              { label: 'City', value: ifscApiData.city },
              { label: 'State', value: ifscApiData.state },
            ]}
          />
        )}

        {ifscCall.status === 'error' && (
          <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-warning)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            IFSC not found — please enter your bank name manually.
          </div>
        )}
      </div>
    </div>
  );
}
