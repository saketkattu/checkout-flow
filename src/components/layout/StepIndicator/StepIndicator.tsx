import styles from './StepIndicator.module.css';

const STEPS = [
  { id: 1, label: 'Business' },
  { id: 2, label: 'Identifiers' },
  { id: 3, label: 'Personnel' },
  { id: 4, label: 'Bank' },
  { id: 5, label: 'Review' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {STEPS.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isClickable = isCompleted && !!onStepClick;

        const nodeClass = [
          styles.node,
          isCompleted ? styles.nodeCompleted : '',
          isActive ? styles.nodeActive : '',
          !isCompleted && !isActive ? styles.nodeUpcoming : '',
        ]
          .filter(Boolean)
          .join(' ');

        const labelClass = [
          styles.stepLabel,
          isActive ? styles.stepLabelActive : '',
          isCompleted ? styles.stepLabelCompleted : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={step.id} className={styles.step}>
            <div
              className={[styles.stepContent, isClickable ? styles.clickable : ''].filter(Boolean).join(' ')}
              onClick={isClickable ? () => onStepClick(step.id) : undefined}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => e.key === 'Enter' && onStepClick(step.id) : undefined}
            >
              <div className={styles.nodeRow}>
                <div className={nodeClass}>
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
              </div>
              <span className={labelClass}>{step.label}</span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className={[styles.connector, isCompleted ? styles.connectorCompleted : ''].filter(Boolean).join(' ')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
