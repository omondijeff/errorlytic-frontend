import React, { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import api from '../../../services/apiClient';
import type { DTC, VehicleDetails, QuotationLineItem } from '../../../types/analysis';

interface GarageQuotationTabProps {
    dtcs: DTC[];
    analysisId: string;
    vehicle: VehicleDetails;
}

const GarageQuotationTab: React.FC<GarageQuotationTabProps> = ({ dtcs, analysisId, vehicle }) => {
    const [lineItems, setLineItems] = useState<QuotationLineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingQuotation, setGeneratingQuotation] = useState(false);
    const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');

    useEffect(() => {
        loadLineItems();
    }, [dtcs]);

    const extractSummary = (fullExplanation: string): string => {
        // Extract first 1-2 sentences as summary
        const sentences = fullExplanation.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) return fullExplanation.substring(0, 150) + '...';
        if (sentences.length === 1) return sentences[0].trim();
        return sentences.slice(0, 2).join('. ').trim() + '.';
    };

    const loadLineItems = async () => {
        setLoading(true);
        const items: QuotationLineItem[] = await Promise.all(
            dtcs.map(async (dtc) => {
                // Estimate cost based on severity (can be enhanced with AI later)
                const baseCost = dtc.status === 'active' ? 5000 : 3000;

                // Fetch AI explanation for MECHANIC (not user)
                let explanation = '';
                let simplifiedSummary = '';
                try {
                    const response = await api.post('/error-codes/ai-explanation', {
                        errorCode: dtc.code,
                        description: dtc.description,
                        vehicleMake: vehicle.make,
                        vehicleModel: vehicle.model,
                        audience: 'mechanic', // Request mechanic-specific explanation
                    });
                    explanation = response.data.data?.aiExplanation || `Error ${dtc.code}: ${dtc.description}`;
                    simplifiedSummary = extractSummary(explanation);
                } catch (error) {
                    explanation = `Error ${dtc.code}: ${dtc.description}. Requires diagnostic scan and component testing.`;
                    simplifiedSummary = `Error ${dtc.code}: ${dtc.description}`;
                }

                return {
                    code: dtc.code,
                    description: dtc.description,
                    explanation,
                    simplifiedSummary,
                    estimatedCost: baseCost,
                    customCost: null,
                    loading: false,
                    explanationExpanded: false,
                };
            })
        );
        setLineItems(items);
        setLoading(false);
    };

    const toggleExplanation = (index: number) => {
        const updated = [...lineItems];
        updated[index].explanationExpanded = !updated[index].explanationExpanded;
        setLineItems(updated);
    };

    const updateLineItemCost = (index: number, cost: number) => {
        const updated = [...lineItems];
        updated[index].customCost = cost;
        setLineItems(updated);
    };

    const getLineItemCost = (item: QuotationLineItem) => {
        return item.customCost !== null ? item.customCost : item.estimatedCost;
    };

    const calculateTotal = () => {
        return lineItems.reduce((sum, item) => sum + getLineItemCost(item), 0);
    };

    const handleGenerateQuotation = async () => {
        setGeneratingQuotation(true);
        try {
            // Create quotation with line items
            const quotationData = {
                analysisId,
                currency,
                lineItems: lineItems.map((item) => ({
                    code: item.code,
                    description: item.description,
                    explanation: item.explanation,
                    cost: getLineItemCost(item),
                })),
                totals: {
                    subtotal: calculateTotal(),
                    tax: calculateTotal() * 0.16, // 16% VAT
                    grand: calculateTotal() * 1.16,
                },
            };

            // For now, we'll use the existing quotation endpoint
            // This might need backend modification to accept line items directly
            const response = await api.post(`/quotations/generate/${analysisId}`, {
                currency,
                laborRate: 2500,
                markupPct: 15,
                taxPct: 16,
                notes: `Quotation generated from ${lineItems.length} error codes`,
                lineItems: quotationData.lineItems, // Send line items to backend
            });

            if (response.data.success || response.data.type === 'quotation_generated') {
                alert('Quotation generated successfully!');
                // Optionally navigate to quotation page
            }
        } catch (error: any) {
            console.error('Failed to generate quotation:', error);
            alert(error.response?.data?.detail || 'Failed to generate quotation');
        } finally {
            setGeneratingQuotation(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Garage Quotation Builder</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Review AI explanations and customize costs for each error code
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as 'KES' | 'USD')}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                    >
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                    </select>
                    <button
                        onClick={handleGenerateQuotation}
                        disabled={generatingQuotation || lineItems.length === 0}
                        className="px-6 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <DocumentTextIcon className="h-5 w-5" />
                        <span>{generatingQuotation ? 'Generating...' : 'Generate Quotation'}</span>
                    </button>
                </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
                {lineItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-6">
                            {/* Left: Error Code and Description */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="font-mono text-lg font-bold text-[#EA6A47] bg-orange-50 px-3 py-1 rounded">
                                        {item.code}
                                    </span>
                                    <span className="text-sm text-gray-500">Line Item #{index + 1}</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">{item.description}</h4>

                                {/* AI Explanation - Collapsible */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg mb-4">
                                    <button
                                        onClick={() => toggleExplanation(index)}
                                        className="w-full flex items-start justify-between p-4 hover:bg-blue-100 transition-colors rounded-lg"
                                    >
                                        <div className="flex items-start space-x-2 flex-1 text-left">
                                            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-blue-900 mb-1">Technical Explanation:</p>
                                                <p className={`text-sm text-blue-800 ${!item.explanationExpanded ? 'line-clamp-2' : ''}`}>
                                                    {item.explanationExpanded ? item.explanation : item.simplifiedSummary}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            {item.explanationExpanded ? (
                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                    {item.explanationExpanded && (
                                        <div className="px-4 pb-4 pt-0">
                                            <div className="pt-3 border-t border-blue-200">
                                                <p className="text-sm text-blue-800 whitespace-pre-wrap">{item.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Cost Input */}
                            <div className="flex-shrink-0 w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repair Cost ({currency})
                                </label>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500">
                                        AI Recommended: {currency} {item.estimatedCost.toLocaleString()}
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={item.customCost !== null ? item.customCost : item.estimatedCost}
                                        onChange={(e) => updateLineItemCost(index, parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent text-lg font-semibold"
                                        placeholder="Enter cost"
                                    />
                                    {item.customCost !== null && item.customCost !== item.estimatedCost && (
                                        <button
                                            onClick={() => updateLineItemCost(index, item.estimatedCost)}
                                            className="text-xs text-[#EA6A47] hover:underline"
                                        >
                                            Reset to AI recommendation
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Line Items</p>
                        <p className="text-2xl font-bold text-gray-900">{lineItems.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-2xl font-bold text-[#EA6A47]">
                            {currency} {calculateTotal().toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Tax (16%)</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {currency} {(calculateTotal() * 0.16).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Grand Total</p>
                        <p className="text-3xl font-bold text-[#EA6A47]">
                            {currency} {(calculateTotal() * 1.16).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarageQuotationTab;
