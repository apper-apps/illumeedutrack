const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusConfig = (status, type) => {
    const configs = {
      offer: {
        'Issued': 'bg-status-issued text-white',
        'Pending': 'bg-status-pending text-white',
        'Declined': 'bg-status-declined text-white'
      },
      gs: {
        'Approved': 'bg-status-approved text-white',
        'Pending': 'bg-status-pending text-white',
        'Declined': 'bg-status-declined text-white'
      },
      coe: {
        'Issued': 'bg-status-issued text-white',
        'Pending': 'bg-status-pending text-white',
        'Release Required': 'bg-status-required text-white'
      },
      default: {
        'Active': 'bg-status-approved text-white',
        'Inactive': 'bg-gray-500 text-white'
      }
    };

    return configs[type]?.[status] || 'bg-gray-500 text-white';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(status, type)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;