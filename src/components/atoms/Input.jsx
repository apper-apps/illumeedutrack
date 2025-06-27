import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  error, 
  icon, 
  type = 'text', 
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={`
            block w-full rounded-lg border transition-colors duration-200
            ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : focused 
                ? 'border-primary focus:border-primary focus:ring-primary'
                : 'border-gray-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-1
            placeholder-gray-400
          `}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;