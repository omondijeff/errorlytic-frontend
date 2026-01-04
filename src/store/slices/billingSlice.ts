import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface BillingPlan {
  id: string;
  name: string;
  tier: 'basic' | 'professional' | 'enterprise';
  price: number;
  currency: 'KES' | 'UGX' | 'TZS' | 'USD';
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    analysesPerMonth: number;
    quotationsPerMonth: number;
    teamSize: number;
    storageGB: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  orgId?: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Usage {
  analysesUsed: number;
  quotationsUsed: number;
  analysesLimit: number;
  quotationsLimit: number;
  period: string;
}

interface BillingState {
  plans: BillingPlan[];
  currentPlan: BillingPlan | null;
  subscription: Subscription | null;
  usage: Usage | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  plans: [],
  currentPlan: null,
  subscription: null,
  usage: null,
  isLoading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<BillingPlan[]>) => {
      state.plans = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<BillingPlan | null>) => {
      state.currentPlan = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.subscription = action.payload;
    },
    setUsage: (state, action: PayloadAction<Usage | null>) => {
      state.usage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlans,
  setCurrentPlan,
  setSubscription,
  setUsage,
  setLoading,
  setError,
} = billingSlice.actions;

export default billingSlice.reducer;
