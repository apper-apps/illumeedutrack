import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PerformanceTable = ({ 
  title, 
  data, 
  type = 'agent', 
  loading = false 
}) => {
  const columns = [
    { key: type, label: type === 'agent' ? 'Agent' : 'Marketer', sortable: true },
    { key: 'applications', label: 'Applications', sortable: true },
    { key: 'offersIssued', label: 'Offers Issued', sortable: true },
    { key: 'conversionRate', label: 'Conversion Rate', sortable: true },
    { key: 'coeIssued', label: 'COE Issued', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true, type: 'currency' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex justify-between py-3 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatValue = (value, column) => {
    if (column.type === 'currency') {
      return `$${value.toLocaleString()}`;
    }
    if (column.key === 'conversionRate') {
      return `${value}%`;
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-card"
    >
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
        <ApperIcon name="Users" size={20} />
        {title}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-4 text-sm text-gray-900">
                    {formatValue(row[column.key], column)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No performance data available</p>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceTable;