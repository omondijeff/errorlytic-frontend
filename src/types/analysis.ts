export interface DTC {
    code: string;
    description: string;
    status: string;
}

export interface AnalysisSummary {
    overview: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    totalErrors: number;
    criticalErrors: number;
    estimatedCost: number;
}

export interface VehicleDetails {
    _id?: string;
    id?: string;
    plate: string;
    make: string;
    model: string;
    year: number;
    ownerInfo?: {
        firstName?: string;
        lastName?: string;
        name?: string;
        phone?: string;
    };
}

export interface AnalysisData {
    _id: string;
    dtcs: DTC[];
    summary: AnalysisSummary;
    causes: string[];
    recommendations: string[];
    aiInsights?: {
        assessment: string;
        model: string;
    };
    vehicleId: VehicleDetails;
    vehicleInfo?: {
        mileage?: number;
        mileageUnit?: string;
    };
}

export interface QuotationLineItem {
    code: string;
    description: string;
    explanation: string;
    simplifiedSummary: string;
    estimatedCost: number;
    customCost: number | null;
    loading: boolean;
    explanationExpanded: boolean;
}
