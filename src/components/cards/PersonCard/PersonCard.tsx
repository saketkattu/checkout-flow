import { useCallback } from 'react';
import styles from './PersonCard.module.css';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { FieldGroup } from '../../primitives/FieldGroup/FieldGroup';
import { Input } from '../../primitives/Input/Input';
import { FileUpload } from '../../primitives/FileUpload/FileUpload';
import { Spinner } from '../../primitives/Spinner/Spinner';
import { verifyIndividualPan } from '../../../services/panVerifyService';
import { useApiCall } from '../../../hooks/useApiCall';
import { useKycContext } from '../../../context/KycContext';
import { validatePan } from '../../../utils/validators';
import type { KycPerson } from '../../../types/kyc';
import type { PanVerifyResult } from '../../../services/types';

interface PersonCardProps {
  person: KycPerson;
  section: 'directors' | 'beneficialOwners' | 'representative';
  canRemove?: boolean;
  onUpdate: (patch: Partial<KycPerson>) => void;
  onRemove?: () => void;
  onToggleExpand: () => void;
}

function getInitials(name: string): string {
  if (!name.trim()) return '?';
  return name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function PersonCard({ person, canRemove, onUpdate, onRemove, onToggleExpand }: PersonCardProps) {
  const { state } = useKycContext();

  const apiFn = useCallback(
    () => verifyIndividualPan(person.document.panNumber),
    [person.document.panNumber]
  );

  const { trigger: verifyPan, callState } = useApiCall<PanVerifyResult>(
    // We use a shared slot; for demo purposes this re-uses 'panLookup' keyed slot
    // In a real app you'd have per-person slots
    'panLookup' as keyof typeof state.apiState,
    apiFn,
    (data) => {
      onUpdate({ document: { ...person.document, panName: data.nameOnPan } });
    }
  );

  const panError = person.document.mode === 'text' && person.document.panNumber
    ? validatePan(person.document.panNumber)
    : null;

  const isVerifying = callState.status === 'loading';
  const isVerified = callState.status === 'success';

  function handlePanBlur(value: string) {
    if (!validatePan(value)) {
      verifyPan();
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={onToggleExpand}>
        <div className={styles.avatar}>{getInitials(person.name)}</div>
        <div className={styles.nameGroup}>
          <div className={[styles.name, !person.name ? styles.namePlaceholder : ''].filter(Boolean).join(' ')}>
            {person.name || 'New person'}
          </div>
          {person.designation && <div className={styles.meta}>{person.designation}</div>}
          {person.ownershipPercent !== undefined && (
            <div className={styles.meta}>{person.ownershipPercent.toFixed(2)}% ownership</div>
          )}
        </div>
        <div className={styles.headerRight}>
          {person.isPreFilled && person.apiSource && (
            <Badge variant={person.apiSource === 'mca' ? 'mca' : person.apiSource === 'session' ? 'neutral' : 'gstn'}>
              {person.apiSource === 'mca' ? 'MCA' : person.apiSource === 'session' ? 'Pre-filled' : 'GSTN'}
            </Badge>
          )}
          {isVerified && <Badge variant="success">Verified</Badge>}
          <svg
            className={[styles.chevron, person.isExpanded ? styles.chevronOpen : ''].filter(Boolean).join(' ')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {person.isExpanded && (
        <div className={styles.body}>
          <FieldGroup label="Full Name" required>
            <Input
              value={person.name}
              onChange={(v) => onUpdate({ name: v })}
              placeholder="Enter full legal name"
            />
          </FieldGroup>

          <div>
            <div className={styles.docToggle}>
              <button
                type="button"
                className={[styles.toggleBtn, person.document.mode === 'text' ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => onUpdate({ document: { ...person.document, mode: 'text' } })}
              >
                Enter PAN
              </button>
              <button
                type="button"
                className={[styles.toggleBtn, person.document.mode === 'upload' ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => onUpdate({ document: { ...person.document, mode: 'upload' } })}
              >
                Upload Document
              </button>
            </div>
          </div>

          {person.document.mode === 'text' ? (
            <>
              <FieldGroup
                label="PAN Number"
                required
                error={panError}
                apiStatus={isVerifying ? 'loading' : null}
                apiStatusLabel="Verifying PAN with Income Tax Dept..."
                prefillSource={person.document.panNumber && isVerified ? 'ITD' : undefined}
              >
                <Input
                  value={person.document.panNumber}
                  onChange={(v) => onUpdate({ document: { ...person.document, panNumber: v } })}
                  onBlur={handlePanBlur}
                  placeholder="ABCDE1234F"
                  transform="uppercase"
                  maxLength={10}
                  mono
                  trailing={isVerifying ? <Spinner size="sm" /> : undefined}
                />
              </FieldGroup>

              {person.document.panName && (
                <FieldGroup label="Name on PAN" prefillSource="ITD">
                  <Input
                    value={person.document.panName}
                    onChange={(v) => onUpdate({ document: { ...person.document, panName: v } })}
                    placeholder="Name as on PAN card"
                    disabled={isVerifying}
                  />
                </FieldGroup>
              )}
            </>
          ) : (
            <FieldGroup label="Upload PAN / Passport" required>
              <FileUpload
                file={person.document.file}
                onChange={(f) => onUpdate({ document: { ...person.document, file: f } })}
              />
            </FieldGroup>
          )}

          {canRemove && (
            <div className={styles.removeBtn}>
              <Button variant="ghost" size="sm" onClick={onRemove}>
                Remove
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
