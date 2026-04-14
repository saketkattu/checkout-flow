import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  KycFormState,
  KycPerson,
  ValidationErrors,
  BusinessIdType,
  DocumentInputMode,
  CurrencyCode,
} from '../types/kyc';
import type { SessionData } from '../types/session';
import type {
  PanInfo,
  GstInfo,
  Director,
  UboEntry,
} from '../services/types';

// ---- API Call State ----

export interface ApiCallState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  source: string | null;
  fetchedAt: string | null;
  errorMessage: string | null;
}

function idleApiState<T>(): ApiCallState<T> {
  return { status: 'idle', data: null, source: null, fetchedAt: null, errorMessage: null };
}

export interface KycApiState {
  panLookup: ApiCallState<PanInfo>;
  gstLookup: ApiCallState<GstInfo>;
  directors: ApiCallState<Director[]>;
  ubos: ApiCallState<UboEntry[]>;
}

// ---- Initial Form State ----

const initialFormState: KycFormState = {
  step1: {
    businessDescription: '',
    onlinePresence: { website: '', socialUrls: [] },
    currencies: ['USD'],
  },
  step2: {
    panDocument: { mode: 'text', panNumber: '', panName: '', file: null },
    businessId: { type: null, value: '', mode: 'text', file: null },
  },
  step3: {
    directors: [],
    beneficialOwners: [],
    representative: null,
  },
  step4: {
    accountHolderName: '',
    accountNumber: '',
    accountNumberConfirm: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
  },
  declaration: false,
};

const initialApiState: KycApiState = {
  panLookup: idleApiState(),
  gstLookup: idleApiState(),
  directors: idleApiState(),
  ubos: idleApiState(),
};

// ---- State Shape ----

interface KycState {
  formState: KycFormState;
  apiState: KycApiState;
  prefillPaths: Set<string>;
  errors: ValidationErrors;
  currentStep: number;
}

// ---- Actions ----

export type KycAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_STEP1_DESCRIPTION'; value: string }
  | { type: 'SET_STEP1_WEBSITE'; value: string }
  | { type: 'SET_STEP1_SOCIAL_URL'; index: number; value: string }
  | { type: 'ADD_SOCIAL_URL' }
  | { type: 'REMOVE_SOCIAL_URL'; index: number }
  | { type: 'SET_STEP1_CURRENCIES'; currencies: CurrencyCode[] }
  | { type: 'SET_PAN_DOC_MODE'; mode: DocumentInputMode }
  | { type: 'SET_PAN_DOC_NUMBER'; value: string }
  | { type: 'SET_PAN_DOC_NAME'; value: string }
  | { type: 'SET_PAN_DOC_FILE'; file: File | null }
  | { type: 'SET_BUSINESS_ID_TYPE'; idType: BusinessIdType }
  | { type: 'SET_BUSINESS_ID_VALUE'; value: string }
  | { type: 'SET_BUSINESS_ID_MODE'; mode: DocumentInputMode }
  | { type: 'SET_BUSINESS_ID_FILE'; file: File | null }
  | { type: 'SET_STEP4_FIELD'; field: keyof KycFormState['step4']; value: string }
  | { type: 'SET_DECLARATION'; value: boolean }
  | { type: 'SET_ERROR'; path: string; message: string }
  | { type: 'CLEAR_ERROR'; path: string }
  | { type: 'MARK_EDITED'; path: string }
  | {
      type: 'API_CALL_START';
      apiKey: keyof KycApiState;
    }
  | {
      type: 'API_CALL_SUCCESS';
      apiKey: keyof KycApiState;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
      source: string;
      fetchedAt: string;
    }
  | {
      type: 'API_CALL_ERROR';
      apiKey: keyof KycApiState;
      errorMessage: string;
    }
  | { type: 'HYDRATE'; sessionData: SessionData }
  | { type: 'SET_DIRECTORS'; directors: KycPerson[] }
  | { type: 'SET_UBOS'; ubos: KycPerson[] }
  | { type: 'ADD_DIRECTOR' }
  | { type: 'ADD_BENEFICIAL_OWNER' }
  | { type: 'REMOVE_PERSON'; section: 'directors' | 'beneficialOwners'; id: string }
  | {
      type: 'UPDATE_PERSON';
      section: 'directors' | 'beneficialOwners' | 'representative';
      id: string;
      patch: Partial<KycPerson>;
    }
  | { type: 'TOGGLE_EXPAND_PERSON'; section: 'directors' | 'beneficialOwners' | 'representative'; id: string }
  | { type: 'SET_REPRESENTATIVE'; rep: KycPerson | null }
  | { type: 'FILL_FROM_PAN'; panInfo: PanInfo }
  | { type: 'FILL_FROM_GST'; gstInfo: GstInfo }
  | { type: 'FILL_ACCOUNT_HOLDER'; name: string };

// ---- Reducer ----

function makePerson(
  id: string,
  name: string,
  isPreFilled: boolean,
  apiSource?: KycPerson['apiSource'],
  extras?: Partial<KycPerson>
): KycPerson {
  return {
    id,
    name,
    isPreFilled,
    apiSource,
    document: { mode: 'text', panNumber: '', panName: '', file: null },
    isExpanded: false,
    ...extras,
  };
}

function reducer(state: KycState, action: KycAction): KycState {
  const { formState, prefillPaths } = state;

  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'SET_STEP1_DESCRIPTION':
      return { ...state, formState: { ...formState, step1: { ...formState.step1, businessDescription: action.value } } };

    case 'SET_STEP1_WEBSITE':
      return {
        ...state,
        formState: {
          ...formState,
          step1: {
            ...formState.step1,
            onlinePresence: { ...formState.step1.onlinePresence, website: action.value },
          },
        },
      };

    case 'SET_STEP1_SOCIAL_URL': {
      const urls = [...formState.step1.onlinePresence.socialUrls];
      urls[action.index] = action.value;
      return {
        ...state,
        formState: {
          ...formState,
          step1: { ...formState.step1, onlinePresence: { ...formState.step1.onlinePresence, socialUrls: urls } },
        },
      };
    }

    case 'ADD_SOCIAL_URL':
      return {
        ...state,
        formState: {
          ...formState,
          step1: {
            ...formState.step1,
            onlinePresence: {
              ...formState.step1.onlinePresence,
              socialUrls: [...formState.step1.onlinePresence.socialUrls, ''],
            },
          },
        },
      };

    case 'REMOVE_SOCIAL_URL': {
      const urls = formState.step1.onlinePresence.socialUrls.filter((_, i) => i !== action.index);
      return {
        ...state,
        formState: {
          ...formState,
          step1: { ...formState.step1, onlinePresence: { ...formState.step1.onlinePresence, socialUrls: urls } },
        },
      };
    }

    case 'SET_STEP1_CURRENCIES':
      return { ...state, formState: { ...formState, step1: { ...formState.step1, currencies: action.currencies } } };

    case 'SET_PAN_DOC_MODE':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, panDocument: { ...formState.step2.panDocument, mode: action.mode } } } };

    case 'SET_PAN_DOC_NUMBER':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, panDocument: { ...formState.step2.panDocument, panNumber: action.value } } } };

    case 'SET_PAN_DOC_NAME':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, panDocument: { ...formState.step2.panDocument, panName: action.value } } } };

    case 'SET_PAN_DOC_FILE':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, panDocument: { ...formState.step2.panDocument, file: action.file } } } };

    case 'SET_BUSINESS_ID_TYPE':
      return {
        ...state,
        formState: {
          ...formState,
          step2: { ...formState.step2, businessId: { type: action.idType, value: '', mode: 'text', file: null } },
        },
      };

    case 'SET_BUSINESS_ID_VALUE':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, businessId: { ...formState.step2.businessId, value: action.value } } } };

    case 'SET_BUSINESS_ID_MODE':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, businessId: { ...formState.step2.businessId, mode: action.mode } } } };

    case 'SET_BUSINESS_ID_FILE':
      return { ...state, formState: { ...formState, step2: { ...formState.step2, businessId: { ...formState.step2.businessId, file: action.file } } } };

    case 'SET_STEP4_FIELD':
      return { ...state, formState: { ...formState, step4: { ...formState.step4, [action.field]: action.value } } };

    case 'SET_DECLARATION':
      return { ...state, formState: { ...formState, declaration: action.value } };

    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.path]: action.message } };

    case 'CLEAR_ERROR': {
      const { [action.path]: _removed, ...rest } = state.errors;
      void _removed;
      return { ...state, errors: rest };
    }

    case 'MARK_EDITED': {
      const newPaths = new Set(prefillPaths);
      newPaths.delete(action.path);
      return { ...state, prefillPaths: newPaths };
    }

    case 'API_CALL_START':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          [action.apiKey]: { ...idleApiState(), status: 'loading' },
        },
      };

    case 'API_CALL_SUCCESS':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          [action.apiKey]: {
            status: 'success',
            data: action.data,
            source: action.source,
            fetchedAt: action.fetchedAt,
            errorMessage: null,
          },
        },
      };

    case 'API_CALL_ERROR':
      return {
        ...state,
        apiState: {
          ...state.apiState,
          [action.apiKey]: {
            status: 'error',
            data: null,
            source: null,
            fetchedAt: null,
            errorMessage: action.errorMessage,
          },
        },
      };

    case 'FILL_FROM_PAN': {
      const { panInfo } = action;
      const newPaths = new Set(prefillPaths);
      newPaths.add('step2.panDocument.panName');
      if (panInfo.cin) newPaths.add('step2.businessId.value');
      return {
        ...state,
        prefillPaths: newPaths,
        formState: {
          ...formState,
          step2: {
            ...formState.step2,
            panDocument: { ...formState.step2.panDocument, panName: panInfo.legalName },
            businessId: panInfo.cin
              ? { ...formState.step2.businessId, type: 'CIN', value: panInfo.cin }
              : formState.step2.businessId,
          },
          step4: {
            ...formState.step4,
            accountHolderName: formState.step4.accountHolderName || panInfo.legalName,
          },
        },
      };
    }

    case 'FILL_FROM_GST': {
      const { gstInfo } = action;
      const newPaths = new Set(prefillPaths);
      newPaths.add('step2.businessId.value');
      return {
        ...state,
        prefillPaths: newPaths,
        formState: {
          ...formState,
          step2: {
            ...formState.step2,
            businessId: { ...formState.step2.businessId, type: 'GSTIN', value: gstInfo.gstin },
          },
        },
      };
    }

    case 'SET_DIRECTORS':
      return { ...state, formState: { ...formState, step3: { ...formState.step3, directors: action.directors } } };

    case 'SET_UBOS':
      return { ...state, formState: { ...formState, step3: { ...formState.step3, beneficialOwners: action.ubos } } };

    case 'ADD_DIRECTOR': {
      const id = `dir-${Date.now()}`;
      return {
        ...state,
        formState: {
          ...formState,
          step3: {
            ...formState.step3,
            directors: [...formState.step3.directors, makePerson(id, '', false)],
          },
        },
      };
    }

    case 'ADD_BENEFICIAL_OWNER': {
      const id = `bo-${Date.now()}`;
      return {
        ...state,
        formState: {
          ...formState,
          step3: {
            ...formState.step3,
            beneficialOwners: [...formState.step3.beneficialOwners, makePerson(id, '', false)],
          },
        },
      };
    }

    case 'REMOVE_PERSON': {
      const list = formState.step3[action.section].filter((p) => p.id !== action.id);
      return {
        ...state,
        formState: { ...formState, step3: { ...formState.step3, [action.section]: list } },
      };
    }

    case 'UPDATE_PERSON': {
      if (action.section === 'representative') {
        const rep = formState.step3.representative;
        if (!rep) return state;
        return {
          ...state,
          formState: {
            ...formState,
            step3: { ...formState.step3, representative: { ...rep, ...action.patch } },
          },
        };
      }
      const list = formState.step3[action.section].map((p) =>
        p.id === action.id ? { ...p, ...action.patch } : p
      );
      return {
        ...state,
        formState: { ...formState, step3: { ...formState.step3, [action.section]: list } },
      };
    }

    case 'TOGGLE_EXPAND_PERSON': {
      if (action.section === 'representative') {
        const rep = formState.step3.representative;
        if (!rep) return state;
        return {
          ...state,
          formState: {
            ...formState,
            step3: { ...formState.step3, representative: { ...rep, isExpanded: !rep.isExpanded } },
          },
        };
      }
      const list = formState.step3[action.section].map((p) =>
        p.id === action.id ? { ...p, isExpanded: !p.isExpanded } : p
      );
      return {
        ...state,
        formState: { ...formState, step3: { ...formState.step3, [action.section]: list } },
      };
    }

    case 'SET_REPRESENTATIVE':
      return { ...state, formState: { ...formState, step3: { ...formState.step3, representative: action.rep } } };

    case 'FILL_ACCOUNT_HOLDER':
      return { ...state, formState: { ...formState, step4: { ...formState.step4, accountHolderName: action.name } } };

    case 'HYDRATE': {
      const { sessionData } = action;
      const newPaths = new Set<string>();
      newPaths.add('step1.businessName');
      const directors: KycPerson[] = sessionData.directors.map((d) =>
        makePerson(d.id, d.name, true, 'session', {
          document: {
            mode: 'text',
            panNumber: d.panNumber ?? '',
            panName: d.panName ?? '',
            file: null,
          },
        })
      );
      const ubos: KycPerson[] = sessionData.beneficialOwners.map((b) =>
        makePerson(b.id, b.name, true, 'session')
      );
      const rep: KycPerson | null = sessionData.representative
        ? makePerson(sessionData.representative.id, sessionData.representative.name, true, 'session')
        : null;

      return {
        ...state,
        prefillPaths: newPaths,
        formState: {
          ...formState,
          step4: { ...formState.step4, accountHolderName: sessionData.legalName },
          step3: { directors, beneficialOwners: ubos, representative: rep },
        },
      };
    }

    default:
      return state;
  }
}

// ---- Context ----

interface KycContextValue {
  state: KycState;
  dispatch: Dispatch<KycAction>;
}

const KycContext = createContext<KycContextValue | null>(null);

export function KycProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    formState: initialFormState,
    apiState: initialApiState,
    prefillPaths: new Set<string>(),
    errors: {},
    currentStep: 1,
  });

  return <KycContext.Provider value={{ state, dispatch }}>{children}</KycContext.Provider>;
}

export function useKycContext(): KycContextValue {
  const ctx = useContext(KycContext);
  if (!ctx) throw new Error('useKycContext must be used within KycProvider');
  return ctx;
}
