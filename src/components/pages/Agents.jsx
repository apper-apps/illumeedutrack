import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/components/molecules/DataTable';
import PerformanceTable from '@/components/organisms/PerformanceTable';
import Button from '@/components/atoms/Button';
import agentService from '@/services/api/agentService';
import analyticsService from '@/services/api/analyticsService';
import { toast } from 'react-toastify';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [agentPerformance, setAgentPerformance] = useState([]);
  const [marketerPerformance, setMarketerPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('agents');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [agentsData, agentPerfData, marketerPerfData] = await Promise.all([
        agentService.getAll(),
        analyticsService.getAgentPerformance(),
        analyticsService.getMarketerPerformance()
      ]);
      
      setAgents(agentsData);
      setAgentPerformance(agentPerfData);
      setMarketerPerformance(marketerPerfData);
    } catch (err) {
      setError(err.message || 'Failed to load agents data');
      toast.error('Failed to load agents data');
    } finally {
      setLoading(false);
    }
  };

const handleEdit = (agent) => {
    toast.info(`Edit functionality for ${agent?.Name || agent?.name || 'agent'} will be implemented`);
  };

  const handleDelete = async (agent) => {
    if (window.confirm(`Are you sure you want to delete ${agent?.Name || agent?.name || 'this agent'}?`)) {
      try {
        await agentService.delete(agent?.Id);
        toast.success('Agent deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete agent');
      }
    }
  };

  const agentColumns = [
    { key: 'Id', label: 'ID', sortable: true },
    { key: 'name', label: 'Agent Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'active', label: 'Status', sortable: true, type: 'status' }
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load agents data</h3>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agents & Marketers</h1>
          <p className="text-gray-600">Manage agents and track performance metrics</p>
        </div>
        <Button icon="Plus" onClick={() => toast.info('Add agent functionality will be implemented')}>
          Add Agent
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'agents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agent Directory
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'performance'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'agents' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <DataTable
                columns={agentColumns}
data={agents?.map(agent => ({
                  ...agent,
                  active: agent?.active ? 'Active' : 'Inactive'
                })) || []}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <PerformanceTable
                title="Agent Performance Rankings"
                data={agentPerformance}
                type="agent"
                loading={loading}
              />
              
              <PerformanceTable
                title="Marketer Performance Rankings"
                data={marketerPerformance}
                type="marketer"
                loading={loading}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {activeTab === 'agents' && agents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{agents.length}</div>
              <div className="text-sm text-gray-500">Total Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {agents.filter(a => a.active).length}
              </div>
              <div className="text-sm text-gray-500">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {agents.filter(a => !a.active).length}
              </div>
              <div className="text-sm text-gray-500">Inactive Agents</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Agents;