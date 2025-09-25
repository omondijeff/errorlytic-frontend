import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DTC {
  code: string;
  description: string;
  status: 'active' | 'pending' | 'resolved';
}

export interface Analysis {
  id: string;
  uploadId: string;
  userId: string;
  orgId?: string;
  dtcs: DTC[];
  summary: {
    overview: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
  };
  causes: string[];
  recommendations: string[];
  module: string;
  aiEnrichment: {
    enabled: boolean;
    confidence: number;
    provider: string;
  };
  createdAt: string;
}

interface AnalysisState {
  analyses: Analysis[];
  currentAnalysis: Analysis | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    severity?: string;
    module?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: AnalysisState = {
  analyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,
  filters: {},
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setAnalyses: (state, action: PayloadAction<Analysis[]>) => {
      state.analyses = action.payload;
    },
    setCurrentAnalysis: (state, action: PayloadAction<Analysis | null>) => {
      state.currentAnalysis = action.payload;
    },
    addAnalysis: (state, action: PayloadAction<Analysis>) => {
      state.analyses.unshift(action.payload);
    },
    updateAnalysis: (state, action: PayloadAction<{ id: string; updates: Partial<Analysis> }>) => {
      const index = state.analyses.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.analyses[index] = { ...state.analyses[index], ...action.payload.updates };
      }
      if (state.currentAnalysis?.id === action.payload.id) {
        state.currentAnalysis = { ...state.currentAnalysis, ...action.payload.updates };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<AnalysisState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setAnalyses,
  setCurrentAnalysis,
  addAnalysis,
  updateAnalysis,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = analysisSlice.actions;

export default analysisSlice.reducer;
