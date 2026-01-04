import React, { useEffect, useState } from 'react';
import {
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useCheckMpesaStatusQuery } from '../../services/api';

interface MpesaPaymentModalProps {
  checkoutRequestId: string;
  amount: number;
  currency: string;
  onClose: () => void;
  onSuccess: () => void;
}

const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  checkoutRequestId,
  amount,
  currency,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed' | 'cancelled'>('pending');
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 30; // 30 * 3 seconds = 90 seconds max wait

  const { data: statusData, refetch } = useCheckMpesaStatusQuery(checkoutRequestId, {
    skip: status !== 'pending',
  });

  useEffect(() => {
    if (statusData?.data) {
      const newStatus = statusData.data.status;
      if (newStatus === 'completed') {
        setStatus('completed');
        setTimeout(onSuccess, 2000);
      } else if (newStatus === 'failed' || newStatus === 'cancelled') {
        setStatus(newStatus);
      }
    }
  }, [statusData, onSuccess]);

  useEffect(() => {
    if (status !== 'pending') return;

    const pollInterval = setInterval(() => {
      setPollCount((prev) => {
        if (prev >= maxPolls) {
          clearInterval(pollInterval);
          setStatus('failed');
          return prev;
        }
        refetch();
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [status, refetch]);

  const formatPrice = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: curr === 'KES' ? 0 : 2,
    }).format(amt);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">M-Pesa Payment</h3>
          {status === 'pending' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Status Display */}
        <div className="text-center py-8">
          {status === 'pending' && (
            <>
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
                <div className="relative flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                  <DevicePhoneMobileIcon className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Check Your Phone
              </h4>
              <p className="text-gray-600 mb-4">
                We've sent a payment request of{' '}
                <span className="font-bold text-[#EA6A47]">
                  {formatPrice(amount, currency)}
                </span>{' '}
                to your M-Pesa
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Enter your M-Pesa PIN to complete the payment
              </p>
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <ClockIcon className="h-5 w-5 animate-pulse" />
                <span className="text-sm">Waiting for confirmation...</span>
              </div>
              <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(pollCount / maxPolls) * 100}%` }}
                />
              </div>
            </>
          )}

          {status === 'completed' && (
            <>
              <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center bg-green-100 rounded-full">
                <CheckCircleIcon className="h-16 w-16 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h4>
              <p className="text-gray-600 mb-4">
                Your credits have been added to your account
              </p>
              {statusData?.data?.credits && (
                <p className="text-2xl font-bold text-[#EA6A47]">
                  +{statusData.data.credits} Credits
                </p>
              )}
            </>
          )}

          {(status === 'failed' || status === 'cancelled') && (
            <>
              <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center bg-red-100 rounded-full">
                <XCircleIcon className="h-16 w-16 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Payment {status === 'cancelled' ? 'Cancelled' : 'Failed'}
              </h4>
              <p className="text-gray-600 mb-6">
                {status === 'cancelled'
                  ? 'You cancelled the payment request'
                  : 'The payment could not be processed. Please try again.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        {status === 'pending' && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">
              Having trouble?
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>1. Make sure your phone is on and has network</li>
              <li>2. Check if you have sufficient M-Pesa balance</li>
              <li>3. Ensure you haven't blocked our paybill</li>
              <li>4. Try again if the prompt doesn't appear</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaPaymentModal;
