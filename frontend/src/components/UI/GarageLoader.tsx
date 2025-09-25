import React from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  WrenchScrewdriverIcon, 
  CpuChipIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface GarageLoaderProps {
  type?: 'engine' | 'diagnostic' | 'analysis' | 'gear';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const GarageLoader: React.FC<GarageLoaderProps> = ({ 
  type = 'engine', 
  size = 'md', 
  text = 'Processing...' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const getIcon = () => {
    switch (type) {
      case 'engine':
        return <CogIcon className={`${iconSizeClasses[size]} text-tajilabs-primary`} />;
      case 'diagnostic':
        return <CpuChipIcon className={`${iconSizeClasses[size]} text-tajilabs-primary`} />;
      case 'analysis':
        return <ChartBarIcon className={`${iconSizeClasses[size]} text-tajilabs-primary`} />;
      case 'gear':
        return <WrenchScrewdriverIcon className={`${iconSizeClasses[size]} text-tajilabs-primary`} />;
      default:
        return <CogIcon className={`${iconSizeClasses[size]} text-tajilabs-primary`} />;
    }
  };

  const getAnimation = () => {
    switch (type) {
      case 'engine':
        return 'animate-engine-start';
      case 'diagnostic':
        return 'animate-diagnostic-scan';
      case 'analysis':
        return 'animate-scan-wave';
      case 'gear':
        return 'animate-loading-gear';
      default:
        return 'animate-engine-start';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-tajilabs-primary/10 to-tajilabs-secondary/10 rounded-2xl flex items-center justify-center shadow-sm ${getAnimation()}`}>
        {getIcon()}
      </div>
      {text && (
        <motion.p 
          className="text-sm font-medium text-gray-700 font-sf-pro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default GarageLoader;
