import { useKycContext } from '../context/KycContext';
import { isStepValid } from '../utils/validators';

export function useStepNavigation() {
  const { state, dispatch } = useKycContext();
  const { currentStep, formState, errors } = state;

  const canAdvance = isStepValid(currentStep, formState, errors);

  function goNext() {
    if (canAdvance && currentStep < 5) {
      dispatch({ type: 'SET_STEP', step: currentStep + 1 });
    }
  }

  function goBack() {
    if (currentStep > 1) {
      dispatch({ type: 'SET_STEP', step: currentStep - 1 });
    }
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= 5) {
      dispatch({ type: 'SET_STEP', step });
    }
  }

  return { currentStep, canAdvance, goNext, goBack, goToStep };
}
