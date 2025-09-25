import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:3003';

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
  tagTypes: ['User', 'Analysis', 'Quotation', 'Billing', 'Upload', 'Walkthrough'],
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
} = api;
