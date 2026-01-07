import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} from '../../services/api';

interface CreditPack {
  type: string;
  name: string;
  credits: number;
  pricing: { KES: number; USD: number };
  discount: number;
  popular: boolean;
  enabled: boolean;
}

interface OrganizationPlan {
  type: string;
  name: string;
  description: string;
  pricing: {
    monthly: { KES: number; USD: number };
    yearly: { KES: number; USD: number };
  };
  includedAnalyses: number;
  overageRate: { KES: number; USD: number };
  features: string[];
  enabled: boolean;
}

const PricingManagementPage: React.FC = () => {
  const { data: settingsData, isLoading, refetch } = useGetPlatformSettingsQuery({});
  const [updateSettings, { isLoading: updating }] = useUpdatePlatformSettingsMutation();

  const [editingPack, setEditingPack] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
  const [orgPlans, setOrgPlans] = useState<OrganizationPlan[]>([]);

  // Default pricing data
  const defaultCreditPacks: CreditPack[] = [
    { type: 'small', name: 'Starter Pack', credits: 5, pricing: { KES: 500, USD: 3.75 }, discount: 0, popular: false, enabled: true },
    { type: 'medium', name: 'Standard Pack', credits: 20, pricing: { KES: 1800, USD: 13.50 }, discount: 10, popular: true, enabled: true },
    { type: 'large', name: 'Professional Pack', credits: 50, pricing: { KES: 4000, USD: 30 }, discount: 20, popular: false, enabled: true },
  ];

  const defaultOrgPlans: OrganizationPlan[] = [
    {
      type: 'pro',
      name: 'Pro Plan',
      description: 'For growing garages and insurance teams',
      pricing: { monthly: { KES: 7500, USD: 50 }, yearly: { KES: 75000, USD: 500 } },
      includedAnalyses: 100,
      overageRate: { KES: 50, USD: 0.35 },
      features: ['ai_insights', 'pdf_export', 'walkthrough', 'quotations', 'team_access'],
      enabled: true,
    },
    {
      type: 'enterprise',
      name: 'Enterprise Plan',
      description: 'For large organizations with unlimited needs',
      pricing: { monthly: { KES: 97500, USD: 650 }, yearly: { KES: 975000, USD: 6500 } },
      includedAnalyses: 0,
      overageRate: { KES: 0, USD: 0 },
      features: ['ai_insights', 'pdf_export', 'walkthrough', 'quotations', 'team_access', 'fraud_detection', 'priority_support', 'api_access'],
      enabled: true,
    },
  ];

  useEffect(() => {
    if (settingsData?.data?.pricing) {
      setCreditPacks(settingsData.data.pricing.individual?.creditPacks || defaultCreditPacks);
      setOrgPlans(settingsData.data.pricing.organization?.plans || defaultOrgPlans);
    } else {
      setCreditPacks(defaultCreditPacks);
      setOrgPlans(defaultOrgPlans);
    }
  }, [settingsData]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'KES' ? 0 : 2,
    }).format(amount);
  };

  const getPackIcon = (type: string) => {
    switch (type) {
      case 'small': return <SparklesIcon className="h-6 w-6" />;
      case 'medium': return <BoltIcon className="h-6 w-6" />;
      case 'large': return <RocketLaunchIcon className="h-6 w-6" />;
      default: return <SparklesIcon className="h-6 w-6" />;
    }
  };

  const handlePackChange = (type: string, field: string, value: any) => {
    setCreditPacks(packs =>
      packs.map(p => {
        if (p.type !== type) return p;
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { ...p, [parent]: { ...(p as any)[parent], [child]: value } };
        }
        return { ...p, [field]: value };
      })
    );
  };

  const handlePlanChange = (type: string, field: string, value: any) => {
    setOrgPlans(plans =>
      plans.map(p => {
        if (p.type !== type) return p;
        const parts = field.split('.');
        if (parts.length === 3) {
          const [parent, child, grandchild] = parts;
          return {
            ...p,
            [parent]: {
              ...(p as any)[parent],
              [child]: { ...(p as any)[parent][child], [grandchild]: value },
            },
          };
        }
        if (parts.length === 2) {
          const [parent, child] = parts;
          return { ...p, [parent]: { ...(p as any)[parent], [child]: value } };
        }
        return { ...p, [field]: value };
      })
    );
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        pricing: {
          individual: { creditPacks },
          organization: { plans: orgPlans },
        },
      }).unwrap();
      setEditingPack(null);
      setEditingPlan(null);
      refetch();
      alert('Pricing updated successfully!');
    } catch (error) {
      alert('Failed to update pricing');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
            <p className="text-gray-500 mt-1">Configure credit packs and subscription plans</p>
          </div>
          <button
            onClick={handleSave}
            disabled={updating}
            className="flex items-center space-x-2 bg-[#EA6A47] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#d85a37] transition-colors disabled:opacity-50"
          >
            <CheckIcon className="h-5 w-5" />
            <span>{updating ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Credit Packs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#EA6A47]/10 p-2 rounded-xl">
            <CurrencyDollarIcon className="h-6 w-6 text-[#EA6A47]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Individual Credit Packs</h2>
            <p className="text-sm text-gray-500">Pay-as-you-go pricing for individual users</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <div
              key={pack.type}
              className={`relative border-2 rounded-xl p-5 ${pack.popular ? 'border-[#EA6A47] bg-[#EA6A47]/5' : 'border-gray-200'
                }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-4 bg-[#EA6A47] text-white text-xs font-bold px-2 py-1 rounded">
                  POPULAR
                </span>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${pack.popular ? 'bg-[#EA6A47]/20 text-[#EA6A47]' : 'bg-gray-100 text-gray-600'}`}>
                  {getPackIcon(pack.type)}
                </div>
                <button
                  onClick={() => setEditingPack(editingPack === pack.type ? null : pack.type)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {editingPack === pack.type ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <PencilIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {editingPack === pack.type ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={pack.name}
                    onChange={(e) => handlePackChange(pack.type, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Pack Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={pack.credits}
                      onChange={(e) => handlePackChange(pack.type, 'credits', parseInt(e.target.value))}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Credits"
                    />
                    <input
                      type="number"
                      value={pack.discount}
                      onChange={(e) => handlePackChange(pack.type, 'discount', parseInt(e.target.value))}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="Discount %"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={pack.pricing.KES}
                      onChange={(e) => handlePackChange(pack.type, 'pricing.KES', parseFloat(e.target.value))}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="KES Price"
                    />
                    <input
                      type="number"
                      value={pack.pricing.USD}
                      onChange={(e) => handlePackChange(pack.type, 'pricing.USD', parseFloat(e.target.value))}
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="USD Price"
                    />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pack.popular}
                      onChange={(e) => handlePackChange(pack.type, 'popular', e.target.checked)}
                      className="rounded text-[#EA6A47]"
                    />
                    <span className="text-sm">Mark as popular</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={pack.enabled}
                      onChange={(e) => handlePackChange(pack.type, 'enabled', e.target.checked)}
                      className="rounded text-[#EA6A47]"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900">{pack.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 my-2">
                    {pack.credits} <span className="text-lg font-normal text-gray-500">credits</span>
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">KES: {formatPrice(pack.pricing.KES, 'KES')}</p>
                    <p className="text-gray-600">USD: {formatPrice(pack.pricing.USD, 'USD')}</p>
                    {pack.discount > 0 && (
                      <p className="text-green-600">{pack.discount}% discount</p>
                    )}
                  </div>
                  {!pack.enabled && (
                    <span className="mt-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                      Disabled
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Organization Plans Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-xl">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Organization Subscription Plans</h2>
            <p className="text-sm text-gray-500">Monthly subscription pricing for garages and insurers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgPlans.map((plan) => (
            <div
              key={plan.type}
              className={`border-2 rounded-xl p-5 ${plan.type === 'enterprise' ? 'border-purple-300 bg-purple-50/50' : 'border-gray-200'
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <button
                  onClick={() => setEditingPlan(editingPlan === plan.type ? null : plan.type)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {editingPlan === plan.type ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <PencilIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {editingPlan === plan.type ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(plan.type, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Plan Name"
                  />
                  <textarea
                    value={plan.description}
                    onChange={(e) => handlePlanChange(plan.type, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Monthly KES</label>
                      <input
                        type="number"
                        value={plan.pricing.monthly.KES}
                        onChange={(e) => handlePlanChange(plan.type, 'pricing.monthly.KES', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Monthly USD</label>
                      <input
                        type="number"
                        value={plan.pricing.monthly.USD}
                        onChange={(e) => handlePlanChange(plan.type, 'pricing.monthly.USD', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Included Analyses</label>
                      <input
                        type="number"
                        value={plan.includedAnalyses}
                        onChange={(e) => handlePlanChange(plan.type, 'includedAnalyses', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0 = unlimited"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Overage (KES)</label>
                      <input
                        type="number"
                        value={plan.overageRate.KES}
                        onChange={(e) => handlePlanChange(plan.type, 'overageRate.KES', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={plan.enabled}
                      onChange={(e) => handlePlanChange(plan.type, 'enabled', e.target.checked)}
                      className="rounded text-[#EA6A47]"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly:</span>
                      <span className="font-medium">
                        {formatPrice(plan.pricing.monthly.KES, 'KES')} / {formatPrice(plan.pricing.monthly.USD, 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Included:</span>
                      <span className="font-medium">
                        {plan.includedAnalyses === 0 ? 'Unlimited' : `${plan.includedAnalyses} analyses`}
                      </span>
                    </div>
                    {plan.overageRate.KES > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Overage:</span>
                        <span className="font-medium">{formatPrice(plan.overageRate.KES, 'KES')}/analysis</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {feature.replace('_', ' ')}
                      </span>
                    ))}
                    {plan.features.length > 4 && (
                      <span className="text-xs text-gray-400">+{plan.features.length - 4} more</span>
                    )}
                  </div>
                  {!plan.enabled && (
                    <span className="mt-3 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                      Disabled
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingManagementPage;
