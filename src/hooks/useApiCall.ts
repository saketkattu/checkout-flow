import { useCallback } from 'react';
import { useKycContext, type KycApiState } from '../context/KycContext';
import type { ApiResult } from '../services/types';

/**
 * Generic hook for triggering a mock government API call.
 * Manages loading / success / error lifecycle in KycContext.
 */
export function useApiCall<T>(
  apiKey: keyof KycApiState,
  apiFn: () => Promise<ApiResult<T>>,
  onSuccess?: (data: T, source: string, fetchedAt: string) => void,
  onError?: (message: string) => void
) {
  const { state, dispatch } = useKycContext();
  const apiCallState = state.apiState[apiKey];

  const trigger = useCallback(async () => {
    dispatch({ type: 'API_CALL_START', apiKey });
    const result = await apiFn();
    if (result.success) {
      dispatch({
        type: 'API_CALL_SUCCESS',
        apiKey,
        data: result.response.data,
        source: result.response.source,
        fetchedAt: result.response.fetchedAt,
      });
      onSuccess?.(result.response.data, result.response.source, result.response.fetchedAt);
    } else {
      dispatch({ type: 'API_CALL_ERROR', apiKey, errorMessage: result.error.message });
      onError?.(result.error.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, apiFn]);

  return { trigger, callState: apiCallState as typeof state.apiState[typeof apiKey] };
}
