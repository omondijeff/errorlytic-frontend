import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'lg',
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-tajilabs-primary text-white hover:bg-tajilabs-primary/90 shadow-tajilabs hover:shadow-tajilabs-lg';
      case 'secondary':
        return 'bg-tajilabs-secondary text-tajilabs-primary hover:bg-tajilabs-secondary/90 shadow-sm hover:shadow-md';
      case 'outline':
        return 'border-2 border-tajilabs-primary text-tajilabs-primary hover:bg-tajilabs-primary hover:text-white shadow-sm hover:shadow-md';
      case 'ghost':
        return 'text-tajilabs-primary hover:bg-tajilabs-primary/10';
      case 'gradient':
        return 'bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white hover:from-tajilabs-primary/90 hover:to-tajilabs-secondary/90 shadow-tajilabs hover:shadow-tajilabs-lg';
      default:
        return 'bg-tajilabs-primary text-white hover:bg-tajilabs-primary/90 shadow-tajilabs hover:shadow-tajilabs-lg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-4 text-lg';
      case 'xl':
        return 'px-8 py-5 text-xl';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center font-sf-pro-text font-medium
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-tajilabs-primary/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getRoundedClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
        </motion.div>
      )}

      <div className={`flex items-center ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}

        {children as any}

        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </div>
    </motion.button>
  );
};

export default ModernButton;
