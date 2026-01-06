import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7337';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Analysis', 'Quotation', 'Billing', 'Upload', 'Walkthrough', 'Organization', 'SuperAdmin'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    // Upload endpoints
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Upload'],
    }),
    getUploads: builder.query({
      query: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params;
        return `/upload?page=${page}&limit=${limit}`;
      },
      providesTags: ['Upload'],
    }),
    
    // Analysis endpoints
    processAnalysis: builder.mutation({
      query: (uploadId) => ({
        url: `/analysis/process/${uploadId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Analysis'],
    }),
    getAnalysis: builder.query({
      query: (id) => `/analysis/${id}`,
      providesTags: ['Analysis'],
    }),
    getAnalyses: builder.query({
      query: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params;
        return `/analysis?page=${page}&limit=${limit}`;
      },
      providesTags: ['Analysis'],
    }),
    
    // Quotation endpoints
    generateQuotation: builder.mutation({
      query: ({ analysisId, ...quotationData }) => ({
        url: `/quotations/generate/${analysisId}`,
        method: 'POST',
        body: quotationData,
      }),
      invalidatesTags: ['Quotation'],
    }),
    getQuotations: builder.query({
      query: (params: { page?: number; limit?: number } = {}) => {
        const { page = 1, limit = 10 } = params;
        return `/quotations?page=${page}&limit=${limit}`;
      },
      providesTags: ['Quotation'],
    }),
    updateQuotation: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/quotations/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Quotation'],
    }),
    
    // Billing endpoints
    getBillingPlans: builder.query({
      query: () => '/billing/plans',
      providesTags: ['Billing'],
    }),
    getBillingDashboard: builder.query({
      query: (period = 'monthly') => `/billing/dashboard?period=${period}`,
      providesTags: ['Billing'],
    }),
    getBillingUsage: builder.query({
      query: () => '/billing/usage',
      providesTags: ['Billing'],
    }),
    
    // Walkthrough endpoints
    generateWalkthrough: builder.mutation({
      query: (analysisId) => ({
        url: `/walkthrough/generate/${analysisId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Walkthrough'],
    }),
    getWalkthrough: builder.query({
      query: (analysisId) => `/walkthrough/${analysisId}`,
      providesTags: ['Walkthrough'],
    }),
    
    // Super Admin endpoints
    getUsers: builder.query({
      query: (params: { page?: number; limit?: number; role?: string; status?: string; search?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/superadmin/users?${searchParams.toString()}`;
      },
      providesTags: ['SuperAdmin'],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/superadmin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/superadmin/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/superadmin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    getOrganizations: builder.query({
      query: (params: { page?: number; limit?: number; type?: string; search?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/superadmin/organizations?${searchParams.toString()}`;
      },
      providesTags: ['SuperAdmin'],
    }),
    createOrganization: builder.mutation({
      query: (orgData) => ({
        url: '/superadmin/organizations',
        method: 'POST',
        body: orgData,
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/superadmin/organizations/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/superadmin/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SuperAdmin'],
    }),
    getSystemStats: builder.query({
      query: () => '/superadmin/stats',
      providesTags: ['SuperAdmin'],
    }),
    getAuditLogs: builder.query({
      query: (params: { page?: number; limit?: number; action?: string; userId?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/superadmin/audit?${searchParams.toString()}`;
      },
      providesTags: ['SuperAdmin'],
    }),
    getAnalytics: builder.query({
      query: (params: { period?: string } = {}) => {
        const { period = '30d' } = params;
        return `/superadmin/analytics?period=${period}`;
      },
      providesTags: ['SuperAdmin'],
    }),
    getRevenue: builder.query({
      query: (params: { period?: string } = {}) => {
        const { period = '30d' } = params;
        return `/superadmin/revenue?period=${period}`;
      },
      providesTags: ['SuperAdmin'],
    }),
    getPlatformSettings: builder.query({
      query: () => '/superadmin/settings',
      providesTags: ['SuperAdmin'],
    }),
    updatePlatformSettings: builder.mutation({
      query: (settings) => ({
        url: '/superadmin/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['SuperAdmin'],
    }),

    // Credit endpoints
    getCreditPacks: builder.query({
      query: () => '/credits/packs',
      providesTags: ['Billing'],
    }),
    getCreditBalance: builder.query({
      query: () => '/credits/balance',
      providesTags: ['Billing'],
    }),
    purchaseCredits: builder.mutation({
      query: (purchaseData) => ({
        url: '/credits/purchase',
        method: 'POST',
        body: purchaseData,
      }),
      invalidatesTags: ['Billing'],
    }),
    getCreditHistory: builder.query({
      query: (params: { page?: number; limit?: number; status?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/credits/history?${searchParams.toString()}`;
      },
      providesTags: ['Billing'],
    }),
    getFeatureAccess: builder.query({
      query: () => '/credits/features',
      providesTags: ['Billing'],
    }),
    canAnalyze: builder.query({
      query: () => '/credits/can-analyze',
      providesTags: ['Billing'],
    }),
    validatePromoCode: builder.mutation({
      query: (promoData) => ({
        url: '/credits/promo/validate',
        method: 'POST',
        body: promoData,
      }),
    }),
    addCredits: builder.mutation({
      query: (creditData) => ({
        url: '/credits/add',
        method: 'POST',
        body: creditData,
      }),
      invalidatesTags: ['SuperAdmin', 'Billing'],
    }),

    // Payment endpoints
    verifyPayment: builder.query({
      query: (reference: string) => `/payments/verify/${reference}`,
    }),
    checkMpesaStatus: builder.query({
      query: (checkoutRequestId: string) => `/payments/mpesa/status/${checkoutRequestId}`,
    }),
    getPaymentHistory: builder.query({
      query: (params: { page?: number; limit?: number; status?: string; type?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value.toString());
        });
        return `/payments/history?${searchParams.toString()}`;
      },
      providesTags: ['Billing'],
    }),
    getBanks: builder.query({
      query: (country = 'KE') => `/payments/banks?country=${country}`,
    }),
    requestRefund: builder.mutation({
      query: (refundData) => ({
        url: '/payments/refund',
        method: 'POST',
        body: refundData,
      }),
      invalidatesTags: ['SuperAdmin', 'Billing'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useUploadFileMutation,
  useGetUploadsQuery,
  useProcessAnalysisMutation,
  useGetAnalysisQuery,
  useGetAnalysesQuery,
  useGenerateQuotationMutation,
  useGetQuotationsQuery,
  useUpdateQuotationMutation,
  useGetBillingPlansQuery,
  useGetBillingDashboardQuery,
  useGetBillingUsageQuery,
  useGenerateWalkthroughMutation,
  useGetWalkthroughQuery,
  // Super Admin hooks
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetSystemStatsQuery,
  useGetAuditLogsQuery,
  useGetAnalyticsQuery,
  useGetRevenueQuery,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  // Credit hooks
  useGetCreditPacksQuery,
  useGetCreditBalanceQuery,
  usePurchaseCreditsMutation,
  useGetCreditHistoryQuery,
  useGetFeatureAccessQuery,
  useCanAnalyzeQuery,
  useValidatePromoCodeMutation,
  useAddCreditsMutation,
  // Payment hooks
  useVerifyPaymentQuery,
  useCheckMpesaStatusQuery,
  useGetPaymentHistoryQuery,
  useGetBanksQuery,
  useRequestRefundMutation,
} = api;
