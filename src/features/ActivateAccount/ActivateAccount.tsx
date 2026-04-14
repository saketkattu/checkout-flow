import { useEffect, useState } from 'react';
import styles from './ActivateAccount.module.css';
import { KycProvider, useKycContext } from '../../context/KycContext';
import { Modal } from '../../components/layout/Modal/Modal';
import { StepIndicator } from '../../components/layout/StepIndicator/StepIndicator';
import { Button } from '../../components/primitives/Button/Button';
import { Spinner } from '../../components/primitives/Spinner/Spinner';
import { Step1AboutBusiness } from '../../components/steps/Step1AboutBusiness/Step1AboutBusiness';
import { Step2BusinessIdentifiers } from '../../components/steps/Step2BusinessIdentifiers/Step2BusinessIdentifiers';
import { Step3PersonnelInformation } from '../../components/steps/Step3PersonnelInformation/Step3PersonnelInformation';
import { Step4BankDetails } from '../../components/steps/Step4BankDetails/Step4BankDetails';
import { Step5Summary } from '../../components/steps/Step5Summary/Step5Summary';
import { useStepNavigation } from '../../hooks/useStepNavigation';
import { mockSession } from '../../data/mockSession';
import { isStepValid } from '../../utils/validators';

function ActivateAccountInner({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useKycContext();
  const { currentStep, goNext, goBack, goToStep } = useStepNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Hydrate with session data on mount
  useEffect(() => {
    dispatch({ type: 'HYDRATE', sessionData: mockSession });
  }, [dispatch]);

  const canAdvance = isStepValid(currentStep, state.formState, state.errors);

  async function handleSubmit() {
    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  const stepComponents: Record<number, JSX.Element> = {
    1: <Step1AboutBusiness />,
    2: <Step2BusinessIdentifiers />,
    3: <Step3PersonnelInformation />,
    4: <Step4BankDetails />,
    5: <Step5Summary />,
  };

  const footer = isSubmitted ? undefined : (
    <>
      <div>
        {currentStep > 1 && (
          <Button variant="secondary" onClick={goBack} type="button">
            Back
          </Button>
        )}
      </div>
      <div className={styles.footerRight ?? ''} style={{ display: 'flex', gap: '12px' }}>
        {currentStep < 5 ? (
          <Button
            variant="primary"
            onClick={goNext}
            disabled={!canAdvance}
            type="button"
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!state.formState.declaration || isSubmitting}
            loading={isSubmitting}
            className={styles.submitBtn}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" onDark />
                Activating...
              </>
            ) : (
              'Activate Account'
            )}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <Modal
      title="Activate Account"
      onClose={onClose}
      stepBar={!isSubmitted && <StepIndicator currentStep={currentStep} onStepClick={goToStep} />}
      footer={footer}
    >
      {isSubmitted ? (
        <div className={styles.successOverlay}>
          <div className={styles.successIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Application submitted!</h2>
          <p className={styles.successSubtitle}>
            Your account activation request has been received. We'll review your information and
            get back to you within 1–2 business days.
          </p>
          <Button variant="primary" onClick={onClose} type="button">
            Done
          </Button>
        </div>
      ) : (
        stepComponents[currentStep]
      )}
    </Modal>
  );
}

interface ActivateAccountProps {
  onClose: () => void;
}

export function ActivateAccount({ onClose }: ActivateAccountProps) {
  return (
    <KycProvider>
      <ActivateAccountInner onClose={onClose} />
    </KycProvider>
  );
}
