import { useCallback } from 'react';
import styles from './Step3PersonnelInformation.module.css';
import { useKycContext } from '../../../context/KycContext';
import { useApiCall } from '../../../hooks/useApiCall';
import { PersonCard } from '../../cards/PersonCard/PersonCard';
import { Button } from '../../primitives/Button/Button';
import { FieldGroup } from '../../primitives/FieldGroup/FieldGroup';
import { Input } from '../../primitives/Input/Input';
import { verifyIndividualPan } from '../../../services/panVerifyService';
import { validatePan } from '../../../utils/validators';
import type { PanVerifyResult } from '../../../services/types';

export function Step3PersonnelInformation() {
  const { state, dispatch } = useKycContext();
  const { directors, beneficialOwners, representative } = state.formState.step3;
  const { directors: directorApiState, ubos: uboApiState } = state.apiState;

  const hasApiPreFill =
    directorApiState.status === 'success' || uboApiState.status === 'success';

  // Representative PAN verify
  const repPanApiFn = useCallback(
    () => verifyIndividualPan(representative?.document.panNumber ?? ''),
    [representative?.document.panNumber]
  );
  const { trigger: verifyRepPan, callState: repPanCall } = useApiCall<PanVerifyResult>(
    'panLookup',
    repPanApiFn,
    (data) => {
      if (representative) {
        dispatch({ type: 'UPDATE_PERSON', section: 'representative', id: representative.id, patch: { document: { ...representative.document, panName: data.nameOnPan } } });
      }
    }
  );

  function handleRepPanBlur(value: string) {
    if (!validatePan(value)) verifyRepPan();
  }

  function addRepresentative() {
    dispatch({
      type: 'SET_REPRESENTATIVE',
      rep: {
        id: `rep-${Date.now()}`,
        name: '',
        isPreFilled: false,
        document: { mode: 'text', panNumber: '', panName: '', file: null },
        isExpanded: true,
        relationship: 'Director',
      },
    });
  }

  return (
    <div className={styles.root}>
      <div>
        <h2 className={styles.sectionTitle}>Personnel information</h2>
        <p className={styles.sectionSubtitle}>
          Upload PAN or passport copies for key personnel in your business.
        </p>
      </div>

      {hasApiPreFill && (
        <div className={styles.banner}>
          <svg className={styles.bannerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <p className={styles.bannerText}>
            We've pre-filled this section using data fetched from the{' '}
            <strong>Ministry of Corporate Affairs</strong>. Please review and confirm the details
            below by providing PAN for each person.
          </p>
        </div>
      )}

      {/* Directors */}
      <div className={styles.personSection}>
        <div className={styles.personSectionHeader}>
          <span className={styles.personSectionTitle}>Directors</span>
          <span className={styles.personSectionMeta}>Add at least 2 directors</span>
        </div>

        {directors.length === 0 && (
          <div className={styles.emptySlot}>
            No directors added yet — add manually or fetch from MCA by entering your CIN in the previous step.
          </div>
        )}

        <div className={styles.personCards}>
          {directors.map((d) => (
            <PersonCard
              key={d.id}
              person={d}
              section="directors"
              canRemove={directors.length > 2}
              onUpdate={(patch) => dispatch({ type: 'UPDATE_PERSON', section: 'directors', id: d.id, patch })}
              onRemove={() => dispatch({ type: 'REMOVE_PERSON', section: 'directors', id: d.id })}
              onToggleExpand={() => dispatch({ type: 'TOGGLE_EXPAND_PERSON', section: 'directors', id: d.id })}
            />
          ))}
        </div>

        <Button variant="secondary" size="sm" type="button" onClick={() => dispatch({ type: 'ADD_DIRECTOR' })}>
          + Add a Director
        </Button>
      </div>

      <div className={styles.divider} />

      {/* Beneficial Owners */}
      <div className={styles.personSection}>
        <div className={styles.personSectionHeader}>
          <span className={styles.personSectionTitle}>Beneficial Owners</span>
          <span className={styles.personSectionMeta}>All beneficial owners with &gt;25% ownership</span>
        </div>

        {beneficialOwners.length === 0 && (
          <div className={styles.emptySlot}>
            No beneficial owners found — add manually or fetch from MCA by entering your CIN.
          </div>
        )}

        <div className={styles.personCards}>
          {beneficialOwners.map((bo) => (
            <PersonCard
              key={bo.id}
              person={bo}
              section="beneficialOwners"
              canRemove
              onUpdate={(patch) => dispatch({ type: 'UPDATE_PERSON', section: 'beneficialOwners', id: bo.id, patch })}
              onRemove={() => dispatch({ type: 'REMOVE_PERSON', section: 'beneficialOwners', id: bo.id })}
              onToggleExpand={() => dispatch({ type: 'TOGGLE_EXPAND_PERSON', section: 'beneficialOwners', id: bo.id })}
            />
          ))}
        </div>

        <Button variant="secondary" size="sm" type="button" onClick={() => dispatch({ type: 'ADD_BENEFICIAL_OWNER' })}>
          + Add a Beneficial Owner
        </Button>
      </div>

      <div className={styles.divider} />

      {/* Business Representative */}
      <div className={styles.personSection}>
        <div className={styles.personSectionHeader}>
          <span className={styles.personSectionTitle}>Business Representative</span>
          <span className={styles.personSectionMeta}>Add 1 representative</span>
        </div>

        {!representative ? (
          <Button variant="secondary" size="sm" type="button" onClick={addRepresentative}>
            + Add a Business Representative
          </Button>
        ) : (
          <div className={styles.repForm}>
            <FieldGroup label="Full Name" required>
              <Input
                value={representative.name}
                onChange={(v) => dispatch({ type: 'UPDATE_PERSON', section: 'representative', id: representative.id, patch: { name: v } })}
                placeholder="Full legal name"
              />
            </FieldGroup>

            <FieldGroup label="Relationship to Business" required>
              <div className={styles.relationshipOptions}>
                {(['Director', 'Employee', 'Authorized Signatory'] as const).map((r) => (
                  <label key={r} className={styles.radioOption}>
                    <input
                      type="radio"
                      name="repRelationship"
                      value={r}
                      checked={representative.relationship === r}
                      onChange={() => dispatch({ type: 'UPDATE_PERSON', section: 'representative', id: representative.id, patch: { relationship: r } })}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup
              label="PAN Number"
              required
              apiStatus={repPanCall.status === 'loading' ? 'loading' : null}
              apiStatusLabel="Verifying PAN with Income Tax Dept..."
              prefillSource={representative.document.panName ? 'ITD' : undefined}
            >
              <Input
                value={representative.document.panNumber}
                onChange={(v) => dispatch({ type: 'UPDATE_PERSON', section: 'representative', id: representative.id, patch: { document: { ...representative.document, panNumber: v } } })}
                onBlur={handleRepPanBlur}
                placeholder="ABCDE1234F"
                transform="uppercase"
                maxLength={10}
                mono
              />
            </FieldGroup>

            {representative.document.panName && (
              <FieldGroup label="Name on PAN" prefillSource="ITD">
                <Input
                  value={representative.document.panName}
                  onChange={(v) => dispatch({ type: 'UPDATE_PERSON', section: 'representative', id: representative.id, patch: { document: { ...representative.document, panName: v } } })}
                  disabled={repPanCall.status === 'loading'}
                />
              </FieldGroup>
            )}

            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => dispatch({ type: 'SET_REPRESENTATIVE', rep: null })}
            >
              Remove representative
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
