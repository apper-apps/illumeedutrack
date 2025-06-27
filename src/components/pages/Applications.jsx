import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/components/molecules/DataTable';
import FilterBar from '@/components/molecules/FilterBar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import studentService from '@/services/api/studentService';
import agentService from '@/services/api/agentService';
import campusService from '@/services/api/campusService';
import marketerService from '@/services/api/marketerService';
import { toast } from 'react-toastify';
const Applications = () => {
const [students, setStudents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    course: '',
    intake: '',
    location: '',
    offer_status: 'Pending',
    gs_status: 'Pending',
    visa_status: 'Pending',
    amount: '',
    coe_status: 'Pending',
    remarks: '',
    campus: '',
    agent_name: '',
    marketer_name: ''
  });
  const [formLoading, setFormLoading] = useState(false);

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
      const [studentsData, agentsData, campusesData, marketersData] = await Promise.all([
        studentService.getAll(),
        agentService.getAll(),
        campusService.getAll(),
        marketerService.getAll()
      ]);
      
setStudents(studentsData);
      setAgents(agentsData);
      setCampuses(campusesData);
      setMarketers(marketersData);
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
    setSelectedStudent(student);
    setFormData({
      Name: student.Name || '',
      course: student.course || '',
      intake: student.intake || '',
      location: student.location || '',
      offer_status: student.offer_status || 'Pending',
      gs_status: student.gs_status || 'Pending',
      visa_status: student.visa_status || 'Pending',
      amount: student.amount || '',
      coe_status: student.coe_status || 'Pending',
      remarks: student.remarks || '',
      campus: student.campus?.Id || student.campus || '',
      agent_name: student.agent_name?.Id || student.agent_name || '',
      marketer_name: student.marketer_name?.Id || student.marketer_name || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.Name}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success('Student deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleAddStudent = () => {
    setFormData({
      Name: '',
      course: '',
      intake: '',
      location: '',
      offer_status: 'Pending',
      gs_status: 'Pending',
      visa_status: 'Pending',
      amount: '',
      coe_status: 'Pending',
      remarks: '',
      campus: '',
      agent_name: '',
      marketer_name: ''
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (showEditModal && selectedStudent) {
        await studentService.update(selectedStudent.Id, formData);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(formData);
        toast.success('Student added successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      toast.error(`Failed to ${showEditModal ? 'update' : 'add'} student`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
agentOptions: agents.map(agent => ({ value: agent.Id, label: agent.Name })),
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
marketerOptions: marketers.map(marketer => ({ value: marketer.Id, label: marketer.Name }))
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
<Button icon="Plus" onClick={handleAddStudent}>
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {showEditModal ? 'Edit Student' : 'Add New Student'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedStudent(null);
                }}
                icon="X"
              />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Student Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                  options={campuses.map(campus => ({ value: campus.Id, label: campus.Name }))}
                  required
                />
                <Select
                  label="Agent"
                  name="agent_name"
                  value={formData.agent_name}
                  onChange={handleInputChange}
                  options={agents.map(agent => ({ value: agent.Id, label: agent.Name }))}
                  required
                />
                <Select
                  label="Marketer"
                  name="marketer_name"
                  value={formData.marketer_name}
                  onChange={handleInputChange}
                  options={marketers.map(marketer => ({ value: marketer.Id, label: marketer.Name }))}
                  required
                />
                <Input
                  label="Intake"
                  name="intake"
                  value={formData.intake}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Onshore', label: 'Onshore' },
                    { value: 'Offshore', label: 'Offshore' }
                  ]}
                  required
                />
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Offer Status"
                  name="offer_status"
                  value={formData.offer_status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Issued', label: 'Issued' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="GS Status"
                  name="gs_status"
                  value={formData.gs_status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="Visa Status"
                  name="visa_status"
                  value={formData.visa_status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="COE Status"
                  name="coe_status"
                  value={formData.coe_status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Issued', label: 'Issued' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Release Required', label: 'Release Required' }
                  ]}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter any additional remarks..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedStudent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={formLoading}>
                  {showEditModal ? 'Update Student' : 'Add Student'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Applications;