import { useState } from 'react';
import { ActivateAccount } from './features/ActivateAccount/ActivateAccount';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-midnight)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-6)',
        fontFamily: 'var(--font-family-primary)',
      }}
    >
      {/* Hero-style landing to showcase the modal trigger */}
      <div style={{ textAlign: 'center', maxWidth: '520px', padding: 'var(--space-8)' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(45, 60, 131, 0.4)',
            border: '1px solid rgba(45, 60, 131, 0.6)',
            fontSize: 'var(--font-size-label)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-pale-indigo)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-5)',
          }}
        >
          Government API Demo
        </div>
        <h1
          style={{
            fontSize: 'var(--font-size-display)',
            fontWeight: 'var(--font-weight-ultralight)',
            color: 'var(--color-pure-white)',
            lineHeight: '56px',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-5)',
          }}
        >
          KYC, powered by government data
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-body)',
            fontWeight: 'var(--font-weight-light)',
            color: 'var(--color-pale-indigo)',
            lineHeight: '24px',
            marginBottom: 'var(--space-8)',
          }}
        >
          See how Xflow auto-fills and verifies your business information using live lookups
          against MCA, GSTN, and Income Tax Department APIs — no manual data entry needed.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--color-pure-white)',
            color: 'var(--color-navy-core)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 32px',
            fontSize: 'var(--font-size-body)',
            fontWeight: 'var(--font-weight-regular)',
            fontFamily: 'var(--font-family-primary)',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-ice-lavender)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-pure-white)')}
        >
          Activate Account →
        </button>

        {/* Demo hint tiles */}
        <div
          style={{
            marginTop: 'var(--space-10)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3)',
            textAlign: 'left',
          }}
        >
          {[
            { label: 'Try PAN', value: 'AABCT1332L', hint: 'TCS — fetches CIN, address' },
            { label: 'Try PAN', value: 'AAFCX1234M', hint: 'Xflow — fetches directors & UBOs' },
            { label: 'Try GSTIN', value: '27AABCT1332L1ZV', hint: 'Fetches GST registration' },
            { label: 'Try IFSC', value: 'HDFC0001234', hint: 'Auto-fills bank name' },
          ].map(({ label, value, hint }) => (
            <div
              key={value}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'rgba(31, 39, 65, 0.6)',
                border: '1px solid rgba(204, 210, 233, 0.15)',
                borderRadius: 'var(--radius-sm)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-steel-lavender)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 'var(--font-size-small)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-pure-white)', margin: '4px 0' }}>{value}</div>
              <div style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-pale-indigo)' }}>{hint}</div>
            </div>
          ))}
        </div>
      </div>

      {isOpen && <ActivateAccount onClose={() => setIsOpen(false)} />}
    </div>
  );
}
