import React, { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    ArrowDownTrayIcon,
    PencilSquareIcon,
    PaperAirplaneIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import api from '../../../services/apiClient';
import type { DTC, VehicleDetails, QuotationLineItem } from '../../../types/analysis';
import { useNotification } from '../../../context/NotificationContext';

interface GarageQuotationTabProps {
    dtcs: DTC[];
    analysisId: string;
    vehicle: VehicleDetails;
}

interface QuotationPart {
    name: string;
    unitPrice: number;
    qty: number;
    subtotal: number;
    partNumber?: string;
    isOEM: boolean;
}

interface Quotation {
    _id: string;
    currency: string;
    labor: {
        hours: number;
        ratePerHour: number;
        subtotal: number;
    };
    parts: QuotationPart[];
    taxPct: number;
    markupPct: number;
    totals: {
        parts: number;
        labor: number;
        tax: number;
        grand: number;
    };
    status: string;
    notes?: string;
    validUntil: string;
    createdAt: string;
}

const GarageQuotationTab: React.FC<GarageQuotationTabProps> = ({ dtcs, analysisId, vehicle }) => {
    const { addNotification } = useNotification();
    const [lineItems, setLineItems] = useState<QuotationLineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingQuotation, setGeneratingQuotation] = useState(false);
    const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
    const [existingQuotation, setExistingQuotation] = useState<Quotation | null>(null);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendEmail, setSendEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, [dtcs, analysisId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Check for existing quotation
            const quotationResponse = await api.get('/quotations', {
                params: { analysisId, limit: 1 }
            });

            if (quotationResponse.data.data && quotationResponse.data.data.length > 0) {
                setExistingQuotation(quotationResponse.data.data[0]);
                setLoading(false);
                return; // Stop if we have a quotation
            }

            // 2. If no quotation, load line items for builder
            await loadLineItems();
        } catch (error) {
            console.error("Failed to load data", error);
            // Fallback to loading line items
            await loadLineItems();
        } finally {
            setLoading(false);
        }
    };

    const extractSummary = (fullExplanation: string): string => {
        const sentences = fullExplanation.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) return fullExplanation.substring(0, 150) + '...';
        if (sentences.length === 1) return sentences[0].trim();
        return sentences.slice(0, 2).join('. ').trim() + '.';
    };

    const loadLineItems = async () => {
        const items: QuotationLineItem[] = await Promise.all(
            dtcs.map(async (dtc) => {
                const baseCost = dtc.status === 'active' ? 5000 : 3000;
                let explanation = '';
                let simplifiedSummary = '';
                try {
                    const response = await api.post('/error-codes/ai-explanation', {
                        errorCode: dtc.code,
                        description: dtc.description,
                        vehicleMake: vehicle.make,
                        vehicleModel: vehicle.model,
                        audience: 'mechanic',
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
            const quotationData = {
                lineItems: lineItems.map((item) => ({
                    code: item.code,
                    description: item.description,
                    explanation: item.explanation,
                    cost: getLineItemCost(item),
                })),
            };

            const response = await api.post(`/quotations/generate/${analysisId}`, {
                currency,
                laborRate: 2500,
                markupPct: 15,
                taxPct: 16,
                notes: `Quotation generated from ${lineItems.length} error codes`,
                lineItems: quotationData.lineItems,
            });

            if (response.data.success || response.data.type === 'quotation_generated') {
                addNotification('Quotation generated successfully!', 'success');
                // Reload to show the view mode
                loadData();
            }
        } catch (error: any) {
            console.error('Failed to generate quotation:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to generate quotation';
            addNotification(typeof errorMessage === 'string' ? errorMessage : 'An error occurred while generating quotation', 'error');
        } finally {
            setGeneratingQuotation(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!existingQuotation) return;
        try {
            const response = await api.get(`/quotations/${existingQuotation._id}/export`, {
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `quotation_${existingQuotation._id.slice(-8).toUpperCase()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            addNotification('Quotation downloaded successfully!', 'success');
        } catch (error) {
            console.error('Failed to download:', error);
            addNotification('Failed to download quotation', 'error');
        }
    };

    const handleSendToClient = async () => {
        if (!existingQuotation) return;

        setSending(true);
        try {
            const payload: { email?: string } = {};
            if (sendEmail.trim()) {
                payload.email = sendEmail.trim();
            }

            const response = await api.post(`/quotations/${existingQuotation._id}/send`, payload);

            if (response.data.type === 'quotation_sent') {
                addNotification(`Quotation sent to ${response.data.data.recipient}`, 'success');
                setShowSendModal(false);
                setSendEmail('');
                // Reload to update status
                loadData();
            }
        } catch (error: any) {
            console.error('Failed to send:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to send quotation';
            addNotification(errorMessage, 'error');
        } finally {
            setSending(false);
        }
    };

    const handleEditQuotation = async () => {
        if (!existingQuotation) return;

        if (!confirm('This will delete the current quotation and allow you to create a new one. Continue?')) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/quotations/${existingQuotation._id}`);
            setExistingQuotation(null);
            addNotification('Quotation deleted. You can now create a new one.', 'success');
            await loadLineItems();
        } catch (error: any) {
            console.error('Failed to delete:', error);
            addNotification('Failed to delete quotation', 'error');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
            </div>
        );
    }

    // --- VIEW MODE ---
    if (existingQuotation) {
        const subtotalBeforeMarkup = existingQuotation.totals.parts + existingQuotation.totals.labor;
        const markupAmount = subtotalBeforeMarkup * (existingQuotation.markupPct / 100);

        return (
            <div className="space-y-6">
                {/* Send Email Modal */}
                {showSendModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                            <div className="bg-[#EA6A47] px-6 py-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Send Quotation to Client</h3>
                                <button
                                    onClick={() => setShowSendModal(false)}
                                    className="text-white/80 hover:text-white"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Send this quotation directly to your client's email. They will receive a professionally formatted email with all the details.
                                </p>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client Email Address
                                </label>
                                <input
                                    type="email"
                                    value={sendEmail}
                                    onChange={(e) => setSendEmail(e.target.value)}
                                    placeholder={vehicle?.ownerInfo?.email || "Enter client email"}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                />
                                {vehicle?.ownerInfo?.email && !sendEmail && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Leave empty to use vehicle owner's email: <strong>{vehicle.ownerInfo.email}</strong>
                                    </p>
                                )}
                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowSendModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendToClient}
                                        disabled={sending}
                                        className="flex-1 px-4 py-3 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {sending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <PaperAirplaneIcon className="h-5 w-5" />
                                                <span>Send Quotation</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <DocumentTextIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Quotation Ready</h3>
                                <p className="text-sm text-gray-600">
                                    Generated on {new Date(existingQuotation.createdAt).toLocaleDateString()} •
                                    Valid until {new Date(existingQuotation.validUntil).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                existingQuotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                existingQuotation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                existingQuotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {existingQuotation.status.charAt(0).toUpperCase() + existingQuotation.status.slice(1)}
                            </span>
                            <button
                                onClick={handleEditQuotation}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                                <span>{deleting ? 'Deleting...' : 'Edit'}</span>
                            </button>
                            <button
                                onClick={() => setShowSendModal(true)}
                                className="px-4 py-2 border border-[#EA6A47] text-[#EA6A47] rounded-lg hover:bg-orange-50 transition-colors flex items-center space-x-2 font-medium"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                                <span>Send to Client</span>
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] transition-colors flex items-center space-x-2 font-medium"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Parts/Services List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900">Services & Parts</h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {existingQuotation.parts.map((part, index) => (
                            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        {part.partNumber && (
                                            <span className="font-mono text-sm font-bold text-[#EA6A47] bg-orange-50 px-2 py-0.5 rounded">
                                                {part.partNumber}
                                            </span>
                                        )}
                                        <span className="font-medium text-gray-900">{part.name}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {existingQuotation.currency} {part.unitPrice.toLocaleString()} × {part.qty}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {existingQuotation.currency} {part.subtotal.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Labor Section */}
                {existingQuotation.labor.hours > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900">Labor</h4>
                        </div>
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Labor Charges</p>
                                <p className="text-sm text-gray-500">
                                    {existingQuotation.labor.hours} hour(s) @ {existingQuotation.currency} {existingQuotation.labor.ratePerHour.toLocaleString()}/hr
                                </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                                {existingQuotation.currency} {existingQuotation.labor.subtotal.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {existingQuotation.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">Notes</p>
                        <p className="text-sm text-blue-800">{existingQuotation.notes}</p>
                    </div>
                )}

                {/* Totals Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Parts/Services Subtotal</span>
                            <span>{existingQuotation.currency} {existingQuotation.totals.parts.toLocaleString()}</span>
                        </div>
                        {existingQuotation.labor.hours > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Labor Subtotal</span>
                                <span>{existingQuotation.currency} {existingQuotation.totals.labor.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-3">
                            <span>Subtotal</span>
                            <span>{existingQuotation.currency} {subtotalBeforeMarkup.toLocaleString()}</span>
                        </div>
                        {existingQuotation.markupPct > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Markup ({existingQuotation.markupPct}%)</span>
                                <span>{existingQuotation.currency} {markupAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Tax ({existingQuotation.taxPct}%)</span>
                            <span>{existingQuotation.currency} {existingQuotation.totals.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-3">
                            <span>Grand Total</span>
                            <span className="text-[#EA6A47]">
                                {existingQuotation.currency} {existingQuotation.totals.grand.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- BUILDER MODE ---
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
