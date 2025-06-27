import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import agentService from "@/services/api/agentService";
import applicationService from "@/services/api/applicationService";
import campusService from "@/services/api/campusService";
import marketerService from "@/services/api/marketerService";
import studentService from "@/services/api/studentService";
import FilterBar from "@/components/molecules/FilterBar";
import DataTable from "@/components/molecules/DataTable";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Applications = () => {
const [applications, setApplications] = useState([]);
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
    student: '',
    campus: '',
    agent: '',
    marketer: '',
    offerStatus: 'Pending',
    gsStatus: 'Pending',
    visaStatus: 'Pending',
    coeStatus: 'Pending',
    remarks: '',
    amount: ''
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
      const [applicationsData, studentsData, agentsData, campusesData, marketersData] = await Promise.all([
        applicationService.getAll(),
        studentService.getAll(),
        agentService.getAll(),
        campusService.getAll(),
        marketerService.getAll()
      ]);
      
      setApplications(applicationsData);
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
      const filteredData = await applicationService.getAll(); // Apply filters when implemented
      setApplications(filteredData);
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
    const sortedData = [...applications].sort((a, b) => {
      const aVal = a[config.key];
      const bVal = b[config.key];
      
      if (config.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    setApplications(sortedData);
  };

const handleEdit = (application) => {
    setSelectedStudent(application);
    setFormData({
      Name: application.Name || '',
      student: application.student?.Id || application.student || '',
      campus: application.campus?.Id || application.campus || '',
      agent: application.agent?.Id || application.agent || '',
      marketer: application.marketer?.Id || application.marketer || '',
      offerStatus: application.offerStatus || 'Pending',
      gsStatus: application.gsStatus || 'Pending',
      visaStatus: application.visaStatus || 'Pending',
      coeStatus: application.coeStatus || 'Pending',
      remarks: application.remarks || '',
      amount: application.amount || ''
    });
    setShowEditModal(true);
  };

const handleDelete = async (application) => {
    if (window.confirm(`Are you sure you want to delete application ${application.Name}?`)) {
      try {
        await applicationService.delete(application.Id);
        toast.success('Application deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete application');
      }
    }
  };

const handleAddApplication = () => {
    setFormData({
      Name: '',
      student: '',
      campus: '',
      agent: '',
      marketer: '',
      offerStatus: 'Pending',
      gsStatus: 'Pending',
      visaStatus: 'Pending',
      coeStatus: 'Pending',
      remarks: '',
      amount: ''
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

try {
      if (showEditModal && selectedStudent) {
        await applicationService.update(selectedStudent.Id, formData);
        toast.success('Application updated successfully');
      } else {
        await applicationService.create(formData);
        toast.success('Application added successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedStudent(null);
      loadData();
    } catch (err) {
      toast.error(`Failed to ${showEditModal ? 'update' : 'add'} application`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const columns = [
    { key: 'Id', label: 'ID', sortable: true },
    { key: 'Name', label: 'Application Name', sortable: true },
    { 
      key: 'student', 
      label: 'Student', 
      sortable: true,
      render: (value) => {
        if (value && typeof value === 'object' && value.Name) {
          return value.Name;
        }
        return value || 'N/A';
      }
    },
    { 
      key: 'campus', 
      label: 'Campus', 
      sortable: true,
      render: (value) => {
        if (value && typeof value === 'object' && value.Name) {
          return value.Name;
        }
        return value || 'N/A';
      }
    },
    { 
      key: 'agent', 
      label: 'Agent', 
      sortable: true,
      render: (value) => {
        if (value && typeof value === 'object' && value.Name) {
          return value.Name;
        }
        return value || 'N/A';
      }
    },
    { 
      key: 'marketer', 
      label: 'Marketer', 
      sortable: true,
      render: (value) => {
        if (value && typeof value === 'object' && value.Name) {
          return value.Name;
        }
        return value || 'N/A';
      }
    },
    { key: 'offerStatus', label: 'Offer Status', sortable: true, type: 'status', statusType: 'offer' },
    { key: 'gsStatus', label: 'GS Status', sortable: true, type: 'status', statusType: 'gs' },
    { key: 'visaStatus', label: 'Visa Status', sortable: true, type: 'status', statusType: 'visa' },
    { key: 'coeStatus', label: 'COE Status', sortable: true, type: 'status', statusType: 'coe' },
    { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
    { key: 'remarks', label: 'Remarks', sortable: false }
  ];

const filterOptions = {
    agentOptions: agents.map(agent => ({ value: agent.Id, label: agent.Name })),
    studentOptions: students.map(student => ({ value: student.Id, label: student.Name })),
    campusOptions: campuses.map(campus => ({ value: campus.Id, label: campus.Name })),
    marketerOptions: marketers.map(marketer => ({ value: marketer.Id, label: marketer.Name })),
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
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Manage and track all applications</p>
        </div>
        <Button icon="Plus" onClick={handleAddApplication}>
          Add Application
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
          data={applications}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Summary Stats */}
{applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {applications.filter(a => a.offerStatus === 'Issued').length}
              </div>
              <div className="text-sm text-gray-500">Offers Issued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {applications.filter(a => a.coeStatus === 'Issued').length}
              </div>
              <div className="text-sm text-gray-500">COE Issued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                ${applications.filter(a => a.offerStatus === 'Issued').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString()}
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
                {showEditModal ? 'Edit Application' : 'Add New Application'}
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
                  label="Application Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Student"
                  name="student"
                  value={formData.student}
                  onChange={handleInputChange}
                  options={students.map(student => ({ value: student.Id, label: student.Name }))}
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
                  name="agent"
                  value={formData.agent}
                  onChange={handleInputChange}
                  options={agents.map(agent => ({ value: agent.Id, label: agent.Name }))}
                  required
                />
                <Select
                  label="Marketer"
                  name="marketer"
                  value={formData.marketer}
                  onChange={handleInputChange}
                  options={marketers.map(marketer => ({ value: marketer.Id, label: marketer.Name }))}
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
                  name="offerStatus"
                  value={formData.offerStatus}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Issued', label: 'Issued' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="GS Status"
                  name="gsStatus"
                  value={formData.gsStatus}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="Visa Status"
                  name="visaStatus"
                  value={formData.visaStatus}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Declined', label: 'Declined' }
                  ]}
                />
                <Select
                  label="COE Status"
                  name="coeStatus"
                  value={formData.coeStatus}
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
                  {showEditModal ? 'Update Application' : 'Add Application'}
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