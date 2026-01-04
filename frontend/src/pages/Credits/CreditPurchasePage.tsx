import React, { useState } from 'react';
import {
  CreditCardIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import {
  useGetCreditPacksQuery,
  useGetCreditBalanceQuery,
  usePurchaseCreditsMutation,
  useValidatePromoCodeMutation,
} from '../../services/api';
import MpesaPaymentModal from '../../components/Payment/MpesaPaymentModal';

interface CreditPack {
  type: string;
  name: string;
  credits: number;
  pricing: {
    KES: number;
    USD: number;
  };
  discount: number;
  popular: boolean;
}

const CreditPurchasePage: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'mpesa'>('mpesa');
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  const { data: packsData, isLoading: packsLoading } = useGetCreditPacksQuery({});
  const { data: balanceData } = useGetCreditBalanceQuery({});
  const [purchaseCredits, { isLoading: purchasing }] = usePurchaseCreditsMutation();
  const [validatePromo] = useValidatePromoCodeMutation();

  const packs: CreditPack[] = packsData?.data || [];
  const balance = balanceData?.data;

  const getPackIcon = (type: string) => {
    switch (type) {
      case 'small':
        return <SparklesIcon className="h-8 w-8" />;
      case 'medium':
        return <BoltIcon className="h-8 w-8" />;
      case 'large':
        return <RocketLaunchIcon className="h-8 w-8" />;
      default:
        return <SparklesIcon className="h-8 w-8" />;
    }
  };

  const getPackColor = (type: string, popular: boolean) => {
    if (popular) return 'border-[#EA6A47] bg-gradient-to-br from-[#EA6A47]/5 to-[#EA6A47]/10';
    switch (type) {
      case 'small':
        return 'border-gray-200 bg-white hover:border-gray-300';
      case 'large':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50';
      default:
        return 'border-gray-200 bg-white hover:border-gray-300';
    }
  };

  const formatPrice = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: curr === 'KES' ? 0 : 2,
    }).format(amount);
  };

  const handleValidatePromo = async () => {
    if (!promoCode || !selectedPack) return;

    setPromoError(null);
    setPromoDiscount(null);

    try {
      const result = await validatePromo({
        code: promoCode,
        packType: selectedPack,
        currency,
      }).unwrap();

      if (result.success) {
        setPromoDiscount(result.data.discount);
      }
    } catch (error: any) {
      setPromoError(error.data?.error || 'Invalid promo code');
    }
  };

  const getSelectedPackPrice = () => {
    const pack = packs.find(p => p.type === selectedPack);
    if (!pack) return 0;

    let price = pack.pricing[currency];
    if (pack.discount > 0) {
      price = price * (1 - pack.discount / 100);
    }
    if (promoDiscount) {
      price = price - promoDiscount;
    }
    return Math.max(0, price);
  };

  const handlePurchase = async () => {
    if (!selectedPack) return;

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      alert('Please enter your M-Pesa phone number');
      return;
    }

    try {
      const result = await purchaseCredits({
        packType: selectedPack,
        paymentMethod,
        currency,
        promoCode: promoCode || undefined,
        phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : undefined,
      }).unwrap();

      if (paymentMethod === 'paystack' && result.data.paymentUrl) {
        // Redirect to Paystack payment page
        window.location.href = result.data.paymentUrl;
      } else if (paymentMethod === 'mpesa' && result.data.checkoutRequestId) {
        // Show M-Pesa modal
        setCheckoutRequestId(result.data.checkoutRequestId);
        setShowMpesaModal(true);
      }
    } catch (error: any) {
      alert(error.data?.message || 'Failed to initialize payment');
    }
  };

  if (packsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header with Balance */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Purchase Credits</h1>
            <p className="text-gray-500 mt-1">Buy credits to run diagnostic analyses</p>
          </div>
          {balance && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold text-[#EA6A47]">{balance.available}</p>
              <p className="text-xs text-gray-400">credits available</p>
            </div>
          )}
        </div>
      </div>

      {/* Currency Selector */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Currency:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setCurrency('KES')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currency === 'KES'
                ? 'bg-[#EA6A47] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            KES
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currency === 'USD'
                ? 'bg-[#EA6A47] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packs.map((pack) => (
          <div
            key={pack.type}
            onClick={() => setSelectedPack(pack.type)}
            className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
              getPackColor(pack.type, pack.popular)
            } ${
              selectedPack === pack.type
                ? 'ring-2 ring-[#EA6A47] ring-offset-2'
                : ''
            }`}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#EA6A47] text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className={`inline-flex p-3 rounded-xl mb-4 ${
              pack.popular ? 'bg-[#EA6A47]/10 text-[#EA6A47]' : 'bg-gray-100 text-gray-600'
            }`}>
              {getPackIcon(pack.type)}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{pack.name}</h3>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {pack.credits}
              <span className="text-lg font-normal text-gray-500 ml-1">credits</span>
            </p>

            <div className="mt-4">
              {pack.discount > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(pack.pricing[currency], currency)}
                </p>
              )}
              <p className="text-2xl font-bold text-[#EA6A47]">
                {formatPrice(
                  pack.pricing[currency] * (1 - pack.discount / 100),
                  currency
                )}
              </p>
              {pack.discount > 0 && (
                <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Save {pack.discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {formatPrice(
                (pack.pricing[currency] * (1 - pack.discount / 100)) / pack.credits,
                currency
              )}{' '}
              per analysis
            </p>

            {selectedPack === pack.type && (
              <div className="absolute top-4 right-4">
                <CheckCircleIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Section */}
      {selectedPack && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>

          {/* Promo Code */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code (Optional)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
              />
              <button
                onClick={handleValidatePromo}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="mt-1 text-sm text-red-600">{promoError}</p>
            )}
            {promoDiscount && (
              <p className="mt-1 text-sm text-green-600">
                Promo applied! You save {formatPrice(promoDiscount, currency)}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('mpesa')}
                className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'mpesa'
                    ? 'border-[#EA6A47] bg-[#EA6A47]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />
                <span className="font-medium">M-Pesa</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paystack')}
                className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'paystack'
                    ? 'border-[#EA6A47] bg-[#EA6A47]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCardIcon className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Card</span>
              </button>
            </div>
          </div>

          {/* M-Pesa Phone Number */}
          {paymentMethod === 'mpesa' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0712345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                You will receive an STK push prompt on this number
              </p>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {packs.find(p => p.type === selectedPack)?.name}
                </span>
                <span className="text-gray-900">
                  {packs.find(p => p.type === selectedPack)?.credits} credits
                </span>
              </div>
              {promoDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(promoDiscount, currency)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#EA6A47]">
                  {formatPrice(getSelectedPackPrice(), currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full bg-[#EA6A47] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#d85a37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchasing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ${formatPrice(getSelectedPackPrice(), currency)}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By purchasing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      )}

      {/* M-Pesa Payment Modal */}
      {showMpesaModal && checkoutRequestId && (
        <MpesaPaymentModal
          checkoutRequestId={checkoutRequestId}
          amount={getSelectedPackPrice()}
          currency={currency}
          onClose={() => {
            setShowMpesaModal(false);
            setCheckoutRequestId(null);
          }}
          onSuccess={() => {
            setShowMpesaModal(false);
            setCheckoutRequestId(null);
            // Redirect to success page or refresh balance
            window.location.href = '/app/credits?success=true';
          }}
        />
      )}
    </div>
  );
};

export default CreditPurchasePage;
