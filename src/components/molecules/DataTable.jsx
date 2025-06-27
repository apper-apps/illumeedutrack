import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  onSort,
  sortConfig,
  onEdit,
  onDelete,
  actions = true
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (columnKey) => {
    if (onSort) {
      const direction = sortConfig?.key === columnKey && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key: columnKey, direction });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(data.map(row => row.Id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const formatCellValue = (value, column) => {
    if (column.type === 'status') {
      return <StatusBadge status={value} type={column.statusType} />;
    }
    if (column.type === 'currency') {
      return value ? `$${value.toLocaleString()}` : '$0';
    }
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
    return value || '-';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
                {actions && <th className="px-6 py-3 w-24"></th>}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-t border-gray-200">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      {column.label}
                      <ApperIcon
                        name={
                          sortConfig?.key === column.key
                            ? sortConfig.direction === 'asc'
                              ? 'ChevronUp'
                              : 'ChevronDown'
                            : 'ChevronsUpDown'
                        }
                        size={14}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <motion.tr
                key={row.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.Id)}
                    onChange={(e) => handleSelectRow(row.Id, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
{columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row && row[column.key] !== undefined ? 
                      (column.render ? column.render(row[column.key]) : formatCellValue(row[column.key], column)) 
                      : '-'}
                  </td>
                ))}
                {actions && (onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => onEdit(row)}
                          className="text-gray-600 hover:text-primary"
                          title="Edit"
                        />
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => onDelete(row)}
                          className="text-gray-600 hover:text-error"
                          title="Delete"
                        />
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
          <p className="text-gray-500">Try adjusting your filters or add new records.</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;