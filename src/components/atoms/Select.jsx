import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '',
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            block w-full rounded-lg border transition-colors duration-200
            pl-3 pr-10 py-2 appearance-none bg-white
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-gray-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-1
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
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

export default Select;