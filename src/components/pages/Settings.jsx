import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import DataTable from '@/components/molecules/DataTable';
import userService from '@/services/api/userService';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    role: 'User',
    active: true,
    phone: '',
    department: '',
    position: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const newUser = await userService.createUser(formData);
      const credentials = await userService.generateLoginCredentials(formData);
      
      setGeneratedCredentials(credentials);
      setShowCredentialsModal(true);
      setShowAddUserModal(false);
      
      toast.success('User created successfully');
      loadUsers();
      
      // Reset form
      setFormData({
        Name: '',
        email: '',
        role: 'User',
        active: true,
        phone: '',
        department: '',
        position: ''
      });
    } catch (err) {
      toast.error('Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.Name}?`)) {
      try {
        await userService.deleteUser(user.Id);
        toast.success('User deleted successfully');
        loadUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      Name: user.Name,
      email: user.email,
      role: user.role,
      active: user.active,
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || ''
    });
    setShowAddUserModal(true);
  };

  const handleResetPassword = async (user) => {
    try {
      const credentials = await userService.generateLoginCredentials(user);
      setGeneratedCredentials(credentials);
      setShowCredentialsModal(true);
      toast.success('Password reset successfully');
    } catch (err) {
      toast.error('Failed to reset password');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const userColumns = [
    { key: 'Id', label: 'ID', sortable: true },
    { key: 'Name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { 
      key: 'active', 
      label: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'lastLogin', label: 'Last Login', sortable: true }
  ];

  const tabs = [
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'system', label: 'System Settings', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage system settings and user accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Management Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <Button
              icon="Plus"
              onClick={() => {
                setSelectedUser(null);
                setFormData({
                  Name: '',
                  email: '',
                  role: 'User',
                  active: true,
                  phone: '',
                  department: '',
                  position: ''
                });
                setShowAddUserModal(true);
              }}
            >
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <DataTable
            columns={userColumns}
            data={users}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            customActions={(user) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleResetPassword(user)}
                icon="Key"
              >
                Reset Password
              </Button>
            )}
          />
        </motion.div>
      )}

      {activeTab === 'system' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Name
                </label>
                <Input value="EduTrack Pro" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <Select
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' }
                  ]}
                  value="USD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <Select
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'EST', label: 'Eastern Time' },
                    { value: 'PST', label: 'Pacific Time' }
                  ]}
                  value="UTC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <Select
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                  value="MM/DD/YYYY"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button>Save Changes</Button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to user accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Session Timeout</h3>
                  <p className="text-sm text-gray-500">Automatically log out inactive users</p>
                </div>
                <Select
                  options={[
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                    { value: '480', label: '8 hours' }
                  ]}
                  value="60"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Password Strength Requirements</h3>
                  <p className="text-sm text-gray-500">Enforce strong password policies</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="mt-6">
              <Button>Update Security Settings</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddUserModal(false)}
                icon="X"
              />
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Admin', label: 'Administrator' },
                    { value: 'Manager', label: 'Manager' },
                    { value: 'User', label: 'User' },
                    { value: 'Viewer', label: 'Viewer' }
                  ]}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
                <Input
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active User
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={formLoading}>
                  {selectedUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Login Credentials Modal */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Login Credentials</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredentialsModal(false)}
                icon="X"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-3">
                  Login credentials have been generated. Please share these securely with the user.
                </p>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-blue-900">Email:</label>
                    <code className="block text-sm bg-white px-2 py-1 rounded border">
                      {generatedCredentials.email}
                    </code>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-blue-900">Temporary Password:</label>
                    <code className="block text-sm bg-white px-2 py-1 rounded border">
                      {generatedCredentials.temporaryPassword}
                    </code>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-blue-900">Login URL:</label>
                    <code className="block text-sm bg-white px-2 py-1 rounded border">
                      {generatedCredentials.loginUrl}
                    </code>
                  </div>
                </div>
                
                {generatedCredentials.mustChangePassword && (
                  <p className="text-xs text-blue-700 mt-3">
                    ⚠️ User must change password on first login
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Email: ${generatedCredentials.email}\nPassword: ${generatedCredentials.temporaryPassword}\nLogin: ${generatedCredentials.loginUrl}`
                    );
                    toast.success('Credentials copied to clipboard');
                  }}
                  icon="Copy"
                >
                  Copy Details
                </Button>
                <Button onClick={() => setShowCredentialsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;