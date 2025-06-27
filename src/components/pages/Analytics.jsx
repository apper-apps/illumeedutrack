import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import analyticsService from "@/services/api/analyticsService";
import Applications from "@/components/pages/Applications";
import Dashboard from "@/components/pages/Dashboard";
import ChartContainer from "@/components/organisms/ChartContainer";
import PerformanceTable from "@/components/organisms/PerformanceTable";
import Button from "@/components/atoms/Button";

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
  const [marketerFilters, setMarketerFilters] = useState({});
  const [filteredMarketerPerformance, setFilteredMarketerPerformance] = useState([]);
  const [selectedMarketer, setSelectedMarketer] = useState('');
  const [marketerApplications, setMarketerApplications] = useState([]);
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

{/* Marketer Selection and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-lg p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketer Analytics & Application Filters</h3>
        
        {/* Marketer Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Marketer for Application View</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedMarketer}
              onChange={async (e) => {
                setSelectedMarketer(e.target.value);
                if (e.target.value) {
                  try {
                    const marketerApplications = await analyticsService.getApplicationsByMarketer(e.target.value);
                    setMarketerApplications(marketerApplications);
                    toast.success('Marketer applications loaded successfully');
                  } catch (err) {
                    toast.error('Failed to load marketer applications');
                  }
                } else {
                  setMarketerApplications([]);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a Marketer</option>
              {analyticsData.marketerPerformance.map(marketer => (
                <option key={marketer.marketer} value={marketer.marketer}>
                  {marketer.marketer} ({marketer.applications} applications)
                </option>
              ))}
            </select>
            {selectedMarketer && (
              <Button
                onClick={() => {
                  setSelectedMarketer('');
                  setMarketerApplications([]);
                  toast.info('Marketer selection cleared');
                }}
                variant="secondary"
                icon="X"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>

        {/* Performance Filters */}
        <h4 className="text-md font-medium text-gray-800 mb-3">Performance Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={marketerFilters.campus || ''}
            onChange={(e) => setMarketerFilters({...marketerFilters, campus: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Campuses</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Chitwan">Chitwan</option>
          </select>
          <select
            value={marketerFilters.course || ''}
            onChange={(e) => setMarketerFilters({...marketerFilters, course: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Courses</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
          </select>
          <select
            value={marketerFilters.intake || ''}
            onChange={(e) => setMarketerFilters({...marketerFilters, intake: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Intakes</option>
            <option value="July">July</option>
            <option value="November">November</option>
          </select>
          <Button 
            onClick={async () => {
              try {
                const filtered = await analyticsService.getMarketerPerformanceByFilters(marketerFilters);
                setFilteredMarketerPerformance(filtered);
                toast.success('Marketer performance filtered successfully');
              } catch (err) {
                toast.error('Failed to filter marketer performance');
              }
            }}
            icon="Filter"
          >
            Apply Filters
          </Button>
        </div>
        
        {/* Active Filters Display */}
        {(marketerFilters.campus || marketerFilters.course || marketerFilters.intake) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {marketerFilters.campus && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Campus: {marketerFilters.campus}
              </span>
            )}
            {marketerFilters.course && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Course: {marketerFilters.course}
              </span>
            )}
            {marketerFilters.intake && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Intake: {marketerFilters.intake}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setMarketerFilters({});
                setFilteredMarketerPerformance([]);
                toast.info('Marketer filters cleared');
              }}
              icon="X"
            >
              Clear
            </Button>
          </div>
        )}

        {/* Selected Marketer Applications */}
        {selectedMarketer && marketerApplications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-3">
              Applications by {selectedMarketer} ({marketerApplications.length} total)
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid gap-2">
                {marketerApplications.map((app, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                    <span className="font-medium">{app.studentName || app.Name}</span>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        app.offer_status === 'Issued' ? 'bg-green-100 text-green-800' : 
                        app.offer_status === 'Declined' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.offer_status}
                      </span>
                      <span className="text-gray-500">${app.amount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Filtered Marketer Performance Table */}
      {filteredMarketerPerformance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PerformanceTable
            title="Marketer Performance (Filtered)"
            data={filteredMarketerPerformance}
            type="marketer"
            loading={loading}
          />
        </motion.div>
      )}
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
          <Button icon="Mail" onClick={() => toast.info('Email report functionality will be implemented')}>
            Email Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;