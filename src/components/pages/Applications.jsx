import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/components/molecules/DataTable';
import FilterBar from '@/components/molecules/FilterBar';
import Button from '@/components/atoms/Button';
import studentService from '@/services/api/studentService';
import agentService from '@/services/api/agentService';
import { toast } from 'react-toastify';

const Applications = () => {
  const [students, setStudents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [studentsData, agentsData] = await Promise.all([
        studentService.getAll(),
        agentService.getAll()
      ]);
      
      setStudents(studentsData);
      setAgents(agentsData);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (Object.keys(filters).length === 0) return;
    
    try {
      const filteredData = await studentService.getFilteredData(filters);
      setStudents(filteredData);
    } catch (err) {
      toast.error('Failed to apply filters');
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    loadData();
  };

  const handleSort = (config) => {
    setSortConfig(config);
    const sortedData = [...students].sort((a, b) => {
      const aVal = a[config.key];
      const bVal = b[config.key];
      
      if (config.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    setStudents(sortedData);
  };

  const handleEdit = (student) => {
    // TODO: Implement edit functionality
    toast.info(`Edit functionality for ${student.name} will be implemented`);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success('Student deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete student');
      }
    }
  };
const columns = [
    { key: 'Id', label: 'S.N', sortable: true },
    { key: 'Name', label: 'Student Name', sortable: true },
    { 
      key: 'campus', 
      label: 'Campus', 
      sortable: true,
      render: (value) => value?.Name || value || 'N/A'
    },
    { key: 'course', label: 'Course', sortable: true },
    { 
      key: 'agent_name', 
      label: 'Agent', 
      sortable: true,
      render: (value) => value?.Name || value || 'N/A'
    },
    { key: 'intake', label: 'Intake', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'offer_status', label: 'Offer Status', sortable: true, type: 'status', statusType: 'offer' },
    { key: 'gs_status', label: 'GS Status', sortable: true, type: 'status', statusType: 'gs' },
    { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
    { key: 'coe_status', label: 'COE Status', sortable: true, type: 'status', statusType: 'coe' },
    { key: 'visa_status', label: 'Visa Status', sortable: true, type: 'status', statusType: 'visa' },
    { 
      key: 'marketer_name', 
      label: 'Marketer', 
      sortable: true,
      render: (value) => value?.Name || value || 'N/A'
    },
    { key: 'remarks', label: 'Remarks', sortable: false }
  ];

  const filterOptions = {
    campusOptions: [
      { value: 'Kathmandu', label: 'Kathmandu' },
      { value: 'Chitwan', label: 'Chitwan' }
    ],
    courseOptions: [
      { value: 'BBA', label: 'BBA' },
      { value: 'MBA', label: 'MBA' }
    ],
    agentOptions: agents.map(agent => ({ value: agent.name, label: agent.name })),
    intakeOptions: [
      { value: 'July', label: 'July' },
      { value: 'November', label: 'November' }
    ],
    locationOptions: [
      { value: 'Onshore', label: 'Onshore' },
      { value: 'Offshore', label: 'Offshore' }
    ],
    statusOptions: {
      offer: [
        { value: 'Issued', label: 'Issued' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Declined', label: 'Declined' }
      ],
      gs: [
        { value: 'Approved', label: 'Approved' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Declined', label: 'Declined' }
      ],
coe: [
        { value: 'Issued', label: 'Issued' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Release Required', label: 'Release Required' }
      ],
      visa: [
        { value: 'Approved', label: 'Approved' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Declined', label: 'Declined' }
      ]
    },
    marketerOptions: [
      { value: 'Raj Kumar', label: 'Raj Kumar' },
      { value: 'Sunita Rai', label: 'Sunita Rai' },
      { value: 'Maya Tamang', label: 'Maya Tamang' }
    ]
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load applications</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={loadData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Applications</h1>
          <p className="text-gray-600">Manage and track all student applications</p>
        </div>
        <Button icon="Plus" onClick={() => toast.info('Add student functionality will be implemented')}>
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          {...filterOptions}
        />
      </motion.div>

      {/* Applications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Summary Stats */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{students.length}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
<div className="text-center">
              <div className="text-2xl font-bold text-success">
                {students.filter(s => s.offer_status === 'Issued').length}
              </div>
              <div className="text-sm text-gray-500">Offers Issued</div>
            </div>
<div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {students.filter(s => s.coe_status === 'Issued').length}
              </div>
              <div className="text-sm text-gray-500">COE Issued</div>
            </div>
<div className="text-center">
              <div className="text-2xl font-bold text-warning">
                ${students.filter(s => s.offer_status === 'Issued').reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Collection</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Applications;