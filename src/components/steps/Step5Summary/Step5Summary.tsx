import styles from './Step5Summary.module.css';
import { useKycContext } from '../../../context/KycContext';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { maskAccountNumber } from '../../../utils/formatters';
import type { KycPerson } from '../../../types/kyc';

function initials(name: string) {
  if (!name.trim()) return '?';
  return name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionHeaderTitle}>{title}</span>
      <Button variant="ghost" size="sm" onClick={onEdit} type="button">Edit</Button>
    </div>
  );
}

function Row({ label, value, source }: { label: string; value?: string; source?: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={[styles.rowValue, !value ? styles.rowEmpty : ''].filter(Boolean).join(' ')}>
        {value || 'Not provided'}
        {source && value && <Badge variant={source === 'MCA' ? 'mca' : source === 'GSTN' ? 'gstn' : source === 'ITD' ? 'itd' : 'neutral'}>{source === 'session' ? 'Pre-filled' : `Fetched from ${source}`}</Badge>}
      </span>
    </div>
  );
}

function PersonRow({ person }: { person: KycPerson }) {
  return (
    <div className={styles.personRow}>
      <div className={styles.personAvatar}>{initials(person.name)}</div>
      <div className={styles.personInfo}>
        <div className={styles.personName}>{person.name || 'Unnamed'}</div>
        <div className={styles.personMeta}>
          {person.designation && `${person.designation} · `}
          {person.document.panNumber ? `PAN: ${person.document.panNumber}` : person.document.file ? 'Document uploaded' : 'No document'}
        </div>
      </div>
      {person.isPreFilled && person.apiSource && (
        <Badge variant={person.apiSource === 'mca' ? 'mca' : 'neutral'}>
          {person.apiSource === 'mca' ? 'MCA' : 'Pre-filled'}
        </Badge>
      )}
    </div>
  );
}

export function Step5Summary() {
  const { state, dispatch } = useKycContext();
  const { formState } = state;
  const { step1, step2, step3, step4 } = formState;

  function goTo(step: number) {
    dispatch({ type: 'SET_STEP', step });
  }

  const panSource = state.prefillPaths.has('step2.panDocument.panName') ? 'ITD' : undefined;
  const businessIdSource = state.prefillPaths.has('step2.businessId.value')
    ? step2.businessId.type === 'GSTIN' ? 'GSTN' : 'ITD'
    : undefined;

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Review & submit</h2>
        <p className={styles.subtitle}>
          Please review all the information below before activating your account.
        </p>
      </div>

      {/* Step 1 */}
      <div className={styles.section}>
        <SectionHeader title="Business Information" onEdit={() => goTo(1)} />
        <div className={styles.rows}>
          <Row label="Business description" value={step1.businessDescription ? `${step1.businessDescription.slice(0, 120)}${step1.businessDescription.length > 120 ? '…' : ''}` : undefined} />
          <Row label="Website" value={step1.onlinePresence.website || undefined} />
          <Row label="Currencies" value={step1.currencies.join(', ')} />
        </div>
      </div>

      {/* Step 2 */}
      <div className={styles.section}>
        <SectionHeader title="Business Identifiers" onEdit={() => goTo(2)} />
        <div className={styles.rows}>
          <Row label="PAN Number" value={step2.panDocument.panNumber} source={panSource} />
          <Row label="Name on PAN" value={step2.panDocument.panName} source={panSource} />
          <Row
            label={step2.businessId.type ?? 'Business ID'}
            value={step2.businessId.value}
            source={businessIdSource}
          />
        </div>
      </div>

      {/* Step 3 */}
      <div className={styles.section}>
        <SectionHeader title="Personnel Information" onEdit={() => goTo(3)} />
        {step3.directors.length > 0 && (
          <>
            <div style={{ padding: 'var(--space-3) var(--space-4) 0', fontSize: 'var(--font-size-label)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-steel-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Directors
            </div>
            <div className={styles.personList}>
              {step3.directors.map((d) => <PersonRow key={d.id} person={d} />)}
            </div>
          </>
        )}
        {step3.beneficialOwners.length > 0 && (
          <>
            <div style={{ padding: 'var(--space-3) var(--space-4) 0', fontSize: 'var(--font-size-label)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-steel-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Beneficial Owners
            </div>
            <div className={styles.personList}>
              {step3.beneficialOwners.map((b) => <PersonRow key={b.id} person={b} />)}
            </div>
          </>
        )}
        {step3.representative && (
          <>
            <div style={{ padding: 'var(--space-3) var(--space-4) 0', fontSize: 'var(--font-size-label)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-steel-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Business Representative
            </div>
            <div className={styles.personList}>
              <PersonRow person={step3.representative} />
            </div>
          </>
        )}
      </div>

      {/* Step 4 */}
      <div className={styles.section}>
        <SectionHeader title="Bank Details" onEdit={() => goTo(4)} />
        <div className={styles.rows}>
          <Row label="Account holder" value={step4.accountHolderName} source="session" />
          <Row label="Account number" value={step4.accountNumber ? maskAccountNumber(step4.accountNumber) : undefined} />
          <Row label="IFSC code" value={step4.ifscCode} />
          <Row label="Bank" value={step4.bankName} source={step4.bankName ? 'ITD' : undefined} />
        </div>
      </div>

      {/* Declaration */}
      <div className={styles.declaration}>
        <span className={styles.declarationTitle}>Declaration</span>
        <p className={styles.declarationText}>
          By submitting this form, I/we hereby declare that the information provided above is true,
          accurate, and complete to the best of my/our knowledge. I/we authorize Xflow to verify
          this information with relevant government and financial authorities. I/we understand that
          providing false information may result in rejection of the application and/or legal action.
        </p>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={formState.declaration}
            onChange={(e) => dispatch({ type: 'SET_DECLARATION', value: e.target.checked })}
          />
          <span className={styles.checkboxLabel}>
            I confirm that all the information provided is accurate and I agree to the terms above.
          </span>
        </label>
      </div>
    </div>
  );
}
