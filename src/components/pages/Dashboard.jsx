import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import ChartContainer from '@/components/organisms/ChartContainer';
import analyticsService from '@/services/api/analyticsService';
import marketerPerformanceService from '@/services/api/marketerPerformanceService';
import { toast } from 'react-toastify';

const Dashboard = () => {
const [dashboardData, setDashboardData] = useState({
    stats: null,
    chartData: [],
    marketerPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
try {
        const [stats, monthlyData, marketerPerformance] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getMonthlyData(),
          marketerPerformanceService.getAll()
        ]);

setDashboardData({
          stats,
          chartData: monthlyData,
          marketerPerformance
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

const statCards = [
    {
      title: 'Total Applications',
      value: dashboardData.stats?.totalApplications || 0,
      icon: 'FileText',
      color: 'primary',
      trend: 'up',
      trendValue: 12.5
    },
    {
      title: 'Offers Issued',
      value: dashboardData.stats?.offersIssued || 0,
      icon: 'CheckCircle',
      color: 'success',
      trend: 'up',
      trendValue: 8.2
    },
    {
      title: 'COE Issued',
      value: dashboardData.stats?.coeIssued || 0,
      icon: 'Award',
      color: 'accent',
      trend: 'up',
      trendValue: 15.7
    },
    {
      title: 'Total Collection',
      value: `$${(dashboardData.stats?.totalCollection || 0).toLocaleString()}`,
      icon: 'DollarSign',
      color: 'warning',
      trend: 'up',
      trendValue: 22.1
    }
  ];

  const marketerStats = dashboardData.marketerPerformance.slice(0, 3).map((perf, index) => ({
    title: perf.marketer?.Name || 'Unknown Marketer',
    value: `${perf.totalOffers || 0} offers`,
    icon: 'Megaphone',
    color: index === 0 ? 'primary' : index === 1 ? 'success' : 'accent',
    trend: 'up',
    trendValue: Math.random() * 20 + 5,
    subtitle: `${perf.totalCoes || 0} COEs, $${(perf.totalCollections || 0).toLocaleString()}`
  }));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your student applications and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Marketer Performance Cards */}
      {marketerStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Marketer Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketerStats.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <StatCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartContainer
          title="Application Trends"
          data={dashboardData.chartData}
          showPeriodToggle={true}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="/applications"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">View Applications</h4>
              <p className="text-sm text-gray-500">Manage student applications</p>
            </div>
          </motion.a>

          <motion.a
            href="/analytics"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-500">Detailed performance reports</p>
            </div>
          </motion.a>

          <motion.a
            href="/settings"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Settings</h4>
              <p className="text-sm text-gray-500">Configure system settings</p>
            </div>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;