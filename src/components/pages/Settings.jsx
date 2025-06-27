import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import campusService from '@/services/api/campusService';
import agentService from '@/services/api/agentService';
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('campus');
  const [campuses, setCampuses] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campusData, agentData] = await Promise.all([
        campusService.getAll(),
        agentService.getAll()
      ]);
      setCampuses(campusData);
      setAgents(agentData);
    } catch (err) {
      toast.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'campus') {
        if (formData.Id) {
          await campusService.update(formData.Id, formData);
          toast.success('Campus updated successfully');
        } else {
          await campusService.create(formData);
          toast.success('Campus created successfully');
        }
      } else if (activeTab === 'agent') {
        if (formData.Id) {
          await agentService.update(formData.Id, formData);
          toast.success('Agent updated successfully');
        } else {
          await agentService.create(formData);
          toast.success('Agent created successfully');
        }
      }
      
      setFormData({});
      loadData();
    } catch (err) {
      toast.error('Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = async (item, type) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        if (type === 'campus') {
          await campusService.delete(item.Id);
          toast.success('Campus deleted successfully');
        } else if (type === 'agent') {
          await agentService.delete(item.Id);
          toast.success('Agent deleted successfully');
        }
        loadData();
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  const tabs = [
    { id: 'campus', label: 'Campus Management', icon: 'Building' },
    { id: 'course', label: 'Course Management', icon: 'BookOpen' },
    { id: 'agent', label: 'Agent Management', icon: 'Users' },
    { id: 'intake', label: 'Intake Management', icon: 'Calendar' }
  ];

  const renderCampusForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Campus Name"
        value={formData.name || ''}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <Input
        label="Location"
        value={formData.location || ''}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {formData.Id ? 'Update' : 'Create'} Campus
        </Button>
        {formData.Id && (
          <Button type="button" variant="secondary" onClick={() => setFormData({})}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const renderAgentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Agent Name"
        value={formData.name || ''}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <Input
        label="Phone"
        value={formData.phone || ''}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />
      <Select
        label="Status"
        value={formData.active ? 'true' : 'false'}
        onChange={(e) => setFormData({...formData, active: e.target.value === 'true'})}
        options={[
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]}
      />
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {formData.Id ? 'Update' : 'Create'} Agent
        </Button>
        {formData.Id && (
          <Button type="button" variant="secondary" onClick={() => setFormData({})}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  const renderCourseSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Available Courses</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span>Bachelor of Business Administration (BBA)</span>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Course editing will be implemented')}>
              Edit
            </Button>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span>Master of Business Administration (MBA)</span>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Course editing will be implemented')}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <Button onClick={() => toast.info('Add course functionality will be implemented')}>
        Add New Course
      </Button>
    </div>
  );

  const renderIntakeSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Available Intakes</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span>July Intake</span>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Intake editing will be implemented')}>
              Edit
            </Button>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span>November Intake</span>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Intake editing will be implemented')}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <Button onClick={() => toast.info('Add intake functionality will be implemented')}>
        Add New Intake
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Manage campus, courses, agents, and intake configurations</p>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tab.icon === 'Building' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                  {tab.icon === 'BookOpen' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                  {tab.icon === 'Users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />}
                  {tab.icon === 'Calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'campus' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {formData.Id ? 'Edit Campus' : 'Add New Campus'}
                  </h3>
                  {renderCampusForm()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Campuses</h3>
                  <div className="space-y-2">
                    {campuses.map((campus) => (
                      <div key={campus.Id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{campus.name}</div>
                          <div className="text-sm text-gray-500">{campus.location}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(campus)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(campus, 'campus')}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'course' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {renderCourseSettings()}
            </motion.div>
          )}

          {activeTab === 'agent' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {formData.Id ? 'Edit Agent' : 'Add New Agent'}
                  </h3>
                  {renderAgentForm()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Agents</h3>
                  <div className="space-y-2">
                    {agents.map((agent) => (
                      <div key={agent.Id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.email}</div>
                          <div className="text-xs text-gray-400">{agent.phone}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(agent)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(agent, 'agent')}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'intake' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {renderIntakeSettings()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;