import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface QuotationItem {
  name: string;
  unitPrice: number;
  qty: number;
  subtotal: number;
  partNumber?: string;
  isOEM: boolean;
}

export interface Quotation {
  id: string;
  analysisId: string;
  userId: string;
  orgId?: string;
  currency: 'KES' | 'UGX' | 'TZS' | 'USD';
  labor: {
    hours: number;
    ratePerHour: number;
    subtotal: number;
  };
  parts: QuotationItem[];
  taxPct: number;
  markupPct: number;
  totals: {
    parts: number;
    labor: number;
    tax: number;
    grand: number;
  };
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuotationState {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    currency?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: QuotationState = {
  quotations: [],
  currentQuotation: null,
  isLoading: false,
  error: null,
  filters: {},
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setQuotations: (state, action: PayloadAction<Quotation[]>) => {
      state.quotations = action.payload;
    },
    setCurrentQuotation: (state, action: PayloadAction<Quotation | null>) => {
      state.currentQuotation = action.payload;
    },
    addQuotation: (state, action: PayloadAction<Quotation>) => {
      state.quotations.unshift(action.payload);
    },
    updateQuotation: (state, action: PayloadAction<{ id: string; updates: Partial<Quotation> }>) => {
      const index = state.quotations.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quotations[index] = { ...state.quotations[index], ...action.payload.updates };
      }
      if (state.currentQuotation?.id === action.payload.id) {
        state.currentQuotation = { ...state.currentQuotation, ...action.payload.updates };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<QuotationState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setQuotations,
  setCurrentQuotation,
  addQuotation,
  updateQuotation,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = quotationSlice.actions;

export default quotationSlice.reducer;
