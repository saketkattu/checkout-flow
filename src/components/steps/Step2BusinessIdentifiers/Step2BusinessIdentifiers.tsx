import { useCallback } from 'react';
import styles from './Step2BusinessIdentifiers.module.css';
import { useKycContext } from '../../../context/KycContext';
import { useApiCall } from '../../../hooks/useApiCall';
import { FieldGroup } from '../../primitives/FieldGroup/FieldGroup';
import { Input } from '../../primitives/Input/Input';
import { FileUpload } from '../../primitives/FileUpload/FileUpload';
import { Spinner } from '../../primitives/Spinner/Spinner';
import { ApiResultCard } from '../../cards/ApiResultCard/ApiResultCard';
import { getPanInfo } from '../../../services/panService';
import { searchGstByPan, getGstDetails } from '../../../services/gstService';
import { getDirectorsByCin } from '../../../services/mcaDirectorsService';
import { getUbosByCin } from '../../../services/uboService';
import { validatePan, validateGstin, validateCin } from '../../../utils/validators';
import { formatAddress, formatDate } from '../../../utils/formatters';
import type { BusinessIdType } from '../../../types/kyc';
import type { PanInfo, GstInfo, Director, UboEntry } from '../../../services/types';

const ID_TYPES: { type: BusinessIdType; code: string; desc: string }[] = [
  { type: 'GSTIN', code: 'GSTIN', desc: 'GST Identification Number' },
  { type: 'BUSINESS_PAN', code: 'Business PAN', desc: 'Permanent Account Number' },
  { type: 'CIN', code: 'CIN', desc: 'Company Identification Number' },
];

export function Step2BusinessIdentifiers() {
  const { state, dispatch } = useKycContext();
  const { step2 } = state.formState;
  const { panDocument, businessId } = step2;
  const { panLookup, gstLookup, directors: directorState, ubos: uboState } = state.apiState;

  // PAN Lookup
  const panApiFn = useCallback(() => getPanInfo(panDocument.panNumber), [panDocument.panNumber]);
  const { trigger: lookupPan, callState: panCall } = useApiCall<PanInfo>(
    'panLookup',
    panApiFn,
    (data, source, fetchedAt) => {
      dispatch({ type: 'FILL_FROM_PAN', panInfo: data });
      // Also trigger GST search in parallel
      searchGstByPan(data.panNumber).then((res) => {
        if (res.success) {
          dispatch({ type: 'API_CALL_SUCCESS', apiKey: 'gstLookup', data: res.response.data, source: res.response.source, fetchedAt: res.response.fetchedAt });
          dispatch({ type: 'FILL_FROM_GST', gstInfo: res.response.data });
        }
      });
      // If CIN returned, pre-fetch directors & UBOs
      if (data.cin) {
        getDirectorsByCin(data.cin).then((res) => {
          if (res.success) {
            dispatch({ type: 'API_CALL_SUCCESS', apiKey: 'directors', data: res.response.data, source: res.response.source, fetchedAt: res.response.fetchedAt });
            const persons = res.response.data.map((d: Director, i: number) => ({
              id: `mca-dir-${i}`,
              name: d.name,
              din: d.din,
              designation: d.designation,
              isPreFilled: true,
              apiSource: 'mca' as const,
              document: { mode: 'text' as const, panNumber: d.panNumber ?? '', panName: '', file: null },
              isExpanded: false,
            }));
            dispatch({ type: 'SET_DIRECTORS', directors: persons });
          }
        });
        getUbosByCin(data.cin).then((res) => {
          if (res.success) {
            dispatch({ type: 'API_CALL_SUCCESS', apiKey: 'ubos', data: res.response.data, source: res.response.source, fetchedAt: res.response.fetchedAt });
            const persons = res.response.data.map((u: UboEntry, i: number) => ({
              id: `mca-ubo-${i}`,
              name: u.name,
              ownershipPercent: u.ownershipPercent,
              nationality: u.nationality,
              isPreFilled: true,
              apiSource: 'mca' as const,
              document: { mode: 'text' as const, panNumber: u.panNumber ?? '', panName: '', file: null },
              isExpanded: false,
            }));
            dispatch({ type: 'SET_UBOS', ubos: persons });
          }
        });
      }
      void source; void fetchedAt;
    }
  );

  // GSTIN direct lookup
  const gstApiFn = useCallback(() => getGstDetails(businessId.value), [businessId.value]);
  const { trigger: lookupGst } = useApiCall<GstInfo>(
    'gstLookup',
    gstApiFn,
    (data) => dispatch({ type: 'FILL_FROM_GST', gstInfo: data })
  );

  // CIN directors lookup
  const cinDirectorsApiFn = useCallback(() => getDirectorsByCin(businessId.value), [businessId.value]);
  const { trigger: lookupDirectors } = useApiCall<Director[]>(
    'directors',
    cinDirectorsApiFn,
    (data, source, fetchedAt) => {
      const persons = data.map((d, i) => ({
        id: `mca-dir-${i}`,
        name: d.name,
        din: d.din,
        designation: d.designation,
        isPreFilled: true,
        apiSource: 'mca' as const,
        document: { mode: 'text' as const, panNumber: d.panNumber ?? '', panName: '', file: null },
        isExpanded: false,
      }));
      dispatch({ type: 'SET_DIRECTORS', directors: persons });
      void source; void fetchedAt;
    }
  );

  const cinUboApiFn = useCallback(() => getUbosByCin(businessId.value), [businessId.value]);
  const { trigger: lookupUbos } = useApiCall<UboEntry[]>(
    'ubos',
    cinUboApiFn,
    (data) => {
      const persons = data.map((u, i) => ({
        id: `mca-ubo-${i}`,
        name: u.name,
        ownershipPercent: u.ownershipPercent,
        nationality: u.nationality,
        isPreFilled: true,
        apiSource: 'mca' as const,
        document: { mode: 'text' as const, panNumber: u.panNumber ?? '', panName: '', file: null },
        isExpanded: false,
      }));
      dispatch({ type: 'SET_UBOS', ubos: persons });
    }
  );

  function handlePanBlur(value: string) {
    if (!validatePan(value)) lookupPan();
  }

  function handleBusinessIdBlur(value: string) {
    if (businessId.type === 'GSTIN' && !validateGstin(value)) lookupGst();
    if (businessId.type === 'CIN' && !validateCin(value)) {
      lookupDirectors();
      lookupUbos();
    }
  }

  const panError = panDocument.panNumber && validatePan(panDocument.panNumber);
  const businessIdError = businessId.value && (
    businessId.type === 'GSTIN' ? validateGstin(businessId.value) :
    businessId.type === 'CIN' ? validateCin(businessId.value) :
    businessId.type === 'BUSINESS_PAN' ? validatePan(businessId.value) : null
  );

  const panData = panLookup.data;
  const gstData = gstLookup.data;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div>
        <h2 className={styles.sectionTitle}>Provide IDs and business information</h2>
        <p className={styles.sectionSubtitle}>
          We use government APIs to automatically verify and pre-fill your information.
        </p>
      </div>

      {/* Section A: Individual/Business PAN */}
      <div className={styles.section}>
        <h3 style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-navy-core)' }}>
          PAN Document
        </h3>

        <div className={styles.modeToggle}>
          <button
            type="button"
            className={[styles.toggleBtn, panDocument.mode === 'text' ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
            onClick={() => dispatch({ type: 'SET_PAN_DOC_MODE', mode: 'text' })}
          >
            Enter manually
          </button>
          <button
            type="button"
            className={[styles.toggleBtn, panDocument.mode === 'upload' ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
            onClick={() => dispatch({ type: 'SET_PAN_DOC_MODE', mode: 'upload' })}
          >
            Upload document
          </button>
        </div>

        {panDocument.mode === 'text' ? (
          <div className={styles.twoCol}>
            <FieldGroup
              label="PAN Number"
              required
              error={panError || null}
              apiStatus={panCall.status === 'loading' ? 'loading' : null}
              apiStatusLabel="Verifying PAN with Income Tax Dept..."
            >
              <Input
                value={panDocument.panNumber}
                onChange={(v) => dispatch({ type: 'SET_PAN_DOC_NUMBER', value: v })}
                onBlur={handlePanBlur}
                placeholder="ABCDE1234F"
                transform="uppercase"
                maxLength={10}
                mono
                trailing={panCall.status === 'loading' ? <Spinner size="sm" /> : undefined}
              />
            </FieldGroup>

            <FieldGroup
              label="Name on PAN"
              required
              prefillSource={state.prefillPaths.has('step2.panDocument.panName') ? 'ITD' : undefined}
            >
              <Input
                value={panDocument.panName}
                onChange={(v) => dispatch({ type: 'SET_PAN_DOC_NAME', value: v })}
                placeholder="As printed on PAN card"
                disabled={panCall.status === 'loading'}
              />
            </FieldGroup>
          </div>
        ) : (
          <FieldGroup label="Upload PAN Document" required>
            <FileUpload
              file={panDocument.file}
              onChange={(f) => dispatch({ type: 'SET_PAN_DOC_FILE', file: f })}
            />
          </FieldGroup>
        )}

        {/* API Result Card for PAN */}
        {panCall.status === 'success' && panData && (
          <ApiResultCard
            title="PAN Lookup Result"
            source={panLookup.source ?? 'ITD'}
            fetchedAt={panLookup.fetchedAt ?? ''}
            fields={[
              { label: 'Legal Name', value: panData.legalName, full: true },
              { label: 'Company Type', value: panData.companyType ?? '—' },
              { label: 'Incorporation Date', value: panData.incorporationDate ? formatDate(panData.incorporationDate) : '—' },
              { label: 'CIN', value: panData.cin ?? '—' },
              ...(panData.address ? [{ label: 'Registered Address', value: formatAddress(panData.address), full: true }] : []),
            ]}
          />
        )}

        {panCall.status === 'error' && (
          <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-warning)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {panLookup.errorMessage} — please enter details manually above.
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Section B: Business ID */}
      <div className={styles.section}>
        <h3 style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-navy-core)' }}>
          Business ID
        </h3>

        <div className={styles.idTypeGroup}>
          <span className={styles.idTypeLabel}>Select business identifier type</span>
          <div className={styles.idTypeOptions}>
            {ID_TYPES.map(({ type, code, desc }) => (
              <button
                key={type}
                type="button"
                className={[styles.idTypeCard, businessId.type === type ? styles.idTypeCardSelected : ''].filter(Boolean).join(' ')}
                onClick={() => dispatch({ type: 'SET_BUSINESS_ID_TYPE', idType: type })}
              >
                <span className={styles.idTypeCardCode}>{code}</span>
                <span className={styles.idTypeCardDesc}>{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {businessId.type && (
          <>
            <div className={styles.modeToggle}>
              <button
                type="button"
                className={[styles.toggleBtn, (!businessId.mode || businessId.mode === 'text') ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => dispatch({ type: 'SET_BUSINESS_ID_MODE', mode: 'text' })}
              >
                Enter manually
              </button>
              <button
                type="button"
                className={[styles.toggleBtn, businessId.mode === 'upload' ? styles.toggleBtnActive : ''].filter(Boolean).join(' ')}
                onClick={() => dispatch({ type: 'SET_BUSINESS_ID_MODE', mode: 'upload' })}
              >
                Upload document
              </button>
            </div>

            {(!businessId.mode || businessId.mode === 'text') ? (
              <FieldGroup
                label={businessId.type === 'GSTIN' ? 'GSTIN' : businessId.type === 'CIN' ? 'CIN' : 'Business PAN'}
                required
                error={businessIdError || null}
                prefillSource={state.prefillPaths.has('step2.businessId.value') ? (businessId.type === 'GSTIN' ? 'GSTN' : 'ITD') : undefined}
                apiStatus={
                  (businessId.type === 'GSTIN' && gstLookup.status === 'loading') ||
                  (businessId.type === 'CIN' && (directorState.status === 'loading' || uboState.status === 'loading'))
                    ? 'loading'
                    : null
                }
                apiStatusLabel={
                  businessId.type === 'GSTIN' ? 'Fetching from GSTN Portal...' :
                  businessId.type === 'CIN' ? 'Fetching directors & UBOs from MCA...' :
                  'Verifying with Income Tax Dept...'
                }
              >
                <Input
                  value={businessId.value}
                  onChange={(v) => dispatch({ type: 'SET_BUSINESS_ID_VALUE', value: v })}
                  onBlur={handleBusinessIdBlur}
                  placeholder={
                    businessId.type === 'GSTIN' ? '27ABCDE1234F1Z5' :
                    businessId.type === 'CIN' ? 'L12345AB2004ABC123456' :
                    'ABCDE1234F'
                  }
                  transform="uppercase"
                  mono
                  maxLength={businessId.type === 'GSTIN' ? 15 : businessId.type === 'CIN' ? 21 : 10}
                />
              </FieldGroup>
            ) : (
              <FieldGroup label={`Upload ${businessId.type === 'GSTIN' ? 'GST Certificate' : businessId.type === 'CIN' ? 'Incorporation Certificate' : 'PAN Card'}`} required>
                <FileUpload
                  file={businessId.file}
                  onChange={(f) => dispatch({ type: 'SET_BUSINESS_ID_FILE', file: f })}
                />
              </FieldGroup>
            )}
          </>
        )}

        {/* GST API Result Card */}
        {gstLookup.status === 'success' && gstData && (
          <ApiResultCard
            title="GST Registration Details"
            source={gstLookup.source ?? 'GSTN'}
            fetchedAt={gstLookup.fetchedAt ?? ''}
            fields={[
              { label: 'Legal Name', value: gstData.legalName },
              { label: 'Trade Name', value: gstData.tradeName },
              { label: 'GSTIN', value: gstData.gstin },
              { label: 'Registration Date', value: formatDate(gstData.registrationDate) },
              { label: 'Business Type', value: gstData.businessType },
              { label: 'Registered Address', value: formatAddress(gstData.address), full: true },
            ]}
          />
        )}

        {/* MCA pre-fetch consolidated notice */}
        {(directorState.status === 'success' || uboState.status === 'success') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: '12px 14px', background: 'var(--color-muted-sage)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #1A5C2A' }}>
            <div style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', color: '#1A5C2A' }}>
              Personnel pre-filled from Ministry of Corporate Affairs
            </div>
            {directorState.status === 'success' && directorState.data && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-small)', color: 'var(--color-navy-core)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A5C2A" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {directorState.data.length} director{directorState.data.length !== 1 ? 's' : ''} — review in Personnel step
              </div>
            )}
            {uboState.status === 'success' && uboState.data && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-small)', color: 'var(--color-navy-core)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A5C2A" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {uboState.data.length} beneficial owner{uboState.data.length !== 1 ? 's' : ''} — review in Personnel step
              </div>
            )}
          </div>
        )}

        {/* Loading notice when MCA fetch is in progress */}
        {(directorState.status === 'loading' || uboState.status === 'loading') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-small)', color: 'var(--color-slate-blue)', padding: '8px 12px', background: 'var(--color-ghost-white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-ice-lavender)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: 'spin 1s linear infinite' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Fetching directors and UBOs from MCA…
          </div>
        )}
      </div>
    </div>
  );
}
