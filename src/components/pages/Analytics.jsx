import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChartContainer from '@/components/organisms/ChartContainer';
import PerformanceTable from '@/components/organisms/PerformanceTable';
import Button from '@/components/atoms/Button';
import analyticsService from '@/services/api/analyticsService';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    monthlyData: [],
    weeklyData: [],
    agentPerformance: [],
    marketerPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [monthlyData, weeklyData, agentPerformance, marketerPerformance] = await Promise.all([
        analyticsService.getMonthlyData(),
        analyticsService.getWeeklyData(),
        analyticsService.getAgentPerformance(),
        analyticsService.getMarketerPerformance()
      ]);

      setAnalyticsData({
        monthlyData,
        weeklyData,
        agentPerformance,
        marketerPerformance
      });
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={loadAnalyticsData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed performance analysis and insights</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={period === 'monthly' ? 'primary' : 'secondary'} 
            onClick={() => setPeriod('monthly')}
          >
            Monthly View
          </Button>
          <Button 
            variant={period === 'weekly' ? 'primary' : 'secondary'} 
            onClick={() => setPeriod('weekly')}
          >
            Weekly View
          </Button>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ChartContainer
          title={`${period === 'monthly' ? 'Monthly' : 'Weekly'} Performance Trends`}
          data={period === 'monthly' ? analyticsData.monthlyData : analyticsData.weeklyData}
          loading={loading}
          showPeriodToggle={false}
        />
      </motion.div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PerformanceTable
            title="Agent Performance"
            data={analyticsData.agentPerformance}
            type="agent"
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PerformanceTable
            title="Marketer Performance"
            data={analyticsData.marketerPerformance}
            type="marketer"
            loading={loading}
          />
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-2">
              {analyticsData.agentPerformance.length > 0 
                ? Math.max(...analyticsData.agentPerformance.map(a => parseFloat(a.conversionRate)))
                : 0}%
            </div>
            <div className="text-sm text-gray-600">Highest Agent Conversion Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-success mb-2">
              {analyticsData.marketerPerformance.length > 0 
                ? Math.max(...analyticsData.marketerPerformance.map(m => m.applications))
                : 0}
            </div>
            <div className="text-sm text-gray-600">Most Applications by Marketer</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary mb-2">
              {analyticsData.monthlyData.length > 0 
                ? analyticsData.monthlyData.reduce((sum, m) => sum + m.totalCollection, 0).toLocaleString()
                : 0}
            </div>
            <div className="text-sm text-gray-600">Total Revenue Generated</div>
          </div>
        </div>
      </motion.div>

      {/* Export Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex gap-4">
          <Button icon="Download" onClick={() => toast.info('Export to CSV functionality will be implemented')}>
            Export to CSV
          </Button>
          <Button variant="secondary" icon="FileText" onClick={() => toast.info('Generate report functionality will be implemented')}>
            Generate Report
          </Button>
          <Button variant="accent" icon="Mail" onClick={() => toast.info('Email report functionality will be implemented')}>
            Email Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;