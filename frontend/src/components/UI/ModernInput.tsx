import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'floating' | 'minimal';
}

const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(({
  label,
  error,
  success,
  icon,
  showPasswordToggle = false,
  variant = 'default',
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'floating':
        return `
          relative bg-white/80 backdrop-blur-sm border-2 rounded-2xl transition-all duration-300
          ${error ? 'border-red-300 focus:border-red-500' : 
            success ? 'border-green-300 focus:border-green-500' : 
            isFocused ? 'border-tajilabs-primary shadow-tajilabs' : 'border-gray-200 hover:border-gray-300'}
          ${isFocused || hasValue ? 'pt-6 pb-2' : 'py-4'}
        `;
      case 'minimal':
        return `
          bg-transparent border-0 border-b-2 rounded-none transition-all duration-300
          ${error ? 'border-red-300 focus:border-red-500' : 
            success ? 'border-green-300 focus:border-green-500' : 
            isFocused ? 'border-tajilabs-primary' : 'border-gray-200 hover:border-gray-300'}
        `;
      default:
        return `
          bg-white/90 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 px-4 py-3
          ${error ? 'border-red-300 focus:border-red-500' : 
            success ? 'border-green-300 focus:border-green-500' : 
            isFocused ? 'border-tajilabs-primary shadow-tajilabs' : 'border-gray-200 hover:border-gray-300'}
        `;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {variant === 'floating' && label && (
        <motion.label
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none font-sf-pro-text
            ${isFocused || hasValue 
              ? 'top-2 text-xs text-tajilabs-primary font-medium' 
              : 'top-4 text-sm text-gray-500'}
          `}
          animate={{
            y: isFocused || hasValue ? -8 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          className={`
            w-full transition-all duration-300 font-sf-pro-text text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-0
            ${icon ? 'pl-10' : variant === 'floating' ? 'px-4' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${getVariantClasses()}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={variant === 'floating' ? '' : label}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {success && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {variant !== 'floating' && label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 font-sf-pro-text">
          {label}
        </label>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-2 text-sm text-red-600"
        >
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

export default ModernInput;
