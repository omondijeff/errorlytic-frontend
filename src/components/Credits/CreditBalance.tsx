import React from 'react';
import { Link } from 'react-router-dom';
import {
  BoltIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { useGetCreditBalanceQuery } from '../../services/api';

interface CreditBalanceProps {
  compact?: boolean;
  showBuyButton?: boolean;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({
  compact = false,
  showBuyButton = true,
}) => {
  const { data, isLoading } = useGetCreditBalanceQuery({});
  const balance = data?.data;

  if (isLoading) {
    return (
      <div className={`animate-pulse ${compact ? 'h-8' : 'h-24'} bg-gray-200 rounded-xl`} />
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-[#EA6A47]/10 to-[#EA6A47]/5 px-4 py-2 rounded-full">
        <BoltIcon className="h-5 w-5 text-[#EA6A47]" />
        <span className="font-semibold text-gray-900">{balance?.available || 0}</span>
        <span className="text-gray-500 text-sm">credits</span>
        {showBuyButton && (
          <Link
            to="/app/credits"
            className="ml-2 text-[#EA6A47] hover:text-[#d85a37]"
          >
            <PlusCircleIcon className="h-5 w-5" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Credit Balance</h3>
          <p className="text-sm text-gray-500">Your available analysis credits</p>
        </div>
        <div className="bg-[#EA6A47]/10 p-3 rounded-xl">
          <BoltIcon className="h-6 w-6 text-[#EA6A47]" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold text-gray-900">
            {balance?.available || 0}
          </p>
          <p className="text-sm text-gray-500">credits available</p>
        </div>

        <div className="text-right">
          {balance?.pending > 0 && (
            <p className="text-sm text-yellow-600">
              {balance.pending} pending
            </p>
          )}
          <p className="text-xs text-gray-400">
            {balance?.lifetime || 0} lifetime
          </p>
        </div>
      </div>

      {balance?.available <= 5 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Low balance!</strong> You have {balance?.available} credits remaining.
          </p>
        </div>
      )}

      {showBuyButton && (
        <Link
          to="/app/credits"
          className="mt-4 w-full flex items-center justify-center space-x-2 bg-[#EA6A47] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#d85a37] transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Buy More Credits</span>
        </Link>
      )}

      {balance?.lastUsedAt && (
        <p className="mt-4 text-xs text-gray-400 text-center">
          Last used: {new Date(balance.lastUsedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default CreditBalance;
