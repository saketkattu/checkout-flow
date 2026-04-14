import styles from './Step1AboutBusiness.module.css';
import { useKycContext } from '../../../context/KycContext';
import { FieldGroup } from '../../primitives/FieldGroup/FieldGroup';
import { Textarea } from '../../primitives/Textarea/Textarea';
import { Input } from '../../primitives/Input/Input';
import { Button } from '../../primitives/Button/Button';
import { validateUrl, checkUrlMatchesBusiness, validateMinLength } from '../../../utils/validators';
import type { CurrencyCode } from '../../../types/kyc';

const CURRENCIES: { code: CurrencyCode; name: string }[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
];

export function Step1AboutBusiness() {
  const { state, dispatch } = useKycContext();
  const { step1 } = state.formState;
  const businessName = state.formState.step4.accountHolderName || 'your business';

  const descError = step1.businessDescription.length > 0 && step1.businessDescription.trim().length < 50
    ? validateMinLength(step1.businessDescription, 50, 'Business description')
    : null;

  const websiteError = step1.onlinePresence.website
    ? validateUrl(step1.onlinePresence.website)
    : null;

  const urlMismatch =
    !websiteError &&
    step1.onlinePresence.website &&
    !checkUrlMatchesBusiness(step1.onlinePresence.website, businessName);

  function toggleCurrency(code: CurrencyCode) {
    const current = step1.currencies;
    const next = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    dispatch({ type: 'SET_STEP1_CURRENCIES', currencies: next });
  }

  return (
    <div className={styles.root}>
      {/* Business Description */}
      <div className={styles.section}>
        <div>
          <h2 className={styles.sectionTitle}>Tell us about your business</h2>
          <p className={styles.sectionSubtitle}>
            Describe the goods and services your business exports or imports.
          </p>
        </div>

        <FieldGroup
          label="Business description"
          required
          error={descError}
          hint="Include your products/services, key markets, and business model. Minimum 50 characters."
        >
          <Textarea
            value={step1.businessDescription}
            onChange={(v) => dispatch({ type: 'SET_STEP1_DESCRIPTION', value: v })}
            minChars={50}
            placeholder="We provide software development services to international clients, specializing in fintech and SaaS platforms..."
            rows={4}
          />
        </FieldGroup>

        <div className={styles.tipBanner}>
          <svg className={styles.tipIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className={styles.tipText}>
            Activation times improve <strong>3×</strong> when your business description includes
            accurate information about goods and services being traded internationally.
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Online Presence */}
      <div className={styles.section}>
        <div>
          <h2 className={styles.sectionTitle}>Online presence</h2>
          <p className={styles.sectionSubtitle}>
            Share your business website or social media to help us understand your business better.
          </p>
        </div>

        <FieldGroup
          label="Business website"
          error={websiteError}
          prefillSource={state.prefillPaths.has('step1.businessWebsite') ? 'session' : undefined}
        >
          <Input
            value={step1.onlinePresence.website}
            onChange={(v) => dispatch({ type: 'SET_STEP1_WEBSITE', value: v })}
            onBlur={(v) => dispatch({ type: 'SET_STEP1_WEBSITE', value: v })}
            placeholder="https://yourbusiness.com"
            type="url"
          />
          {urlMismatch && !websiteError && (
            <div className={styles.urlWarning}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Domain doesn't appear to match your business name — please verify this is your official website.
            </div>
          )}
        </FieldGroup>

        {/* Social Media URLs */}
        {step1.onlinePresence.socialUrls.map((url, idx) => (
          <FieldGroup key={idx} label={`Social media URL ${idx + 1}`}>
            <div className={styles.socialRow}>
              <Input
                value={url}
                onChange={(v) => dispatch({ type: 'SET_STEP1_SOCIAL_URL', index: idx, value: v })}
                placeholder="https://linkedin.com/company/..."
              />
              <Button
                variant="ghost"
                size="sm"
                className={styles.removeUrlBtn}
                onClick={() => dispatch({ type: 'REMOVE_SOCIAL_URL', index: idx })}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </FieldGroup>
        ))}

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => dispatch({ type: 'ADD_SOCIAL_URL' })}
        >
          + Add social media URL
        </Button>
      </div>

      <div className={styles.divider} />

      {/* Currencies */}
      <div className={styles.section}>
        <div>
          <h2 className={styles.sectionTitle}>Currencies needed</h2>
          <p className={styles.sectionSubtitle}>
            Select the currencies you transact in. You can update this later.
          </p>
        </div>

        <div className={styles.currencyGrid}>
          {CURRENCIES.map(({ code, name }) => {
            const selected = step1.currencies.includes(code);
            return (
              <button
                key={code}
                type="button"
                className={[styles.currencyChip, selected ? styles.currencyChipSelected : ''].filter(Boolean).join(' ')}
                onClick={() => toggleCurrency(code)}
              >
                {selected && (
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {code} — {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
