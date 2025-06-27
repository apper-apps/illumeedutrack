import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary bg-blue-50',
    success: 'text-success bg-green-50',
    warning: 'text-warning bg-orange-50',
    accent: 'text-accent bg-cyan-50'
  };

  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      return `${(val / 1000).toFixed(0)}K`;
    }
    return val?.toLocaleString() || '0';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500'
            }`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span>{trendValue}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;