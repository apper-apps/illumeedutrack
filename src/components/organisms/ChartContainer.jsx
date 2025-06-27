import { useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ChartContainer = ({ 
  title, 
  data, 
  chartType = 'line',
  showPeriodToggle = true,
  loading = false 
}) => {
  const [period, setPeriod] = useState('monthly');
  const [chartTypeLocal, setChartTypeLocal] = useState(chartType);

  const chartOptions = {
    chart: {
      type: chartTypeLocal,
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#1e40af', '#7c3aed', '#0891b2', '#16a34a'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    xaxis: {
      categories: data.map(item => item.period),
      labels: {
        style: {
          colors: '#6b7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280'
        },
        formatter: (value) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
          return value.toString();
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#374151'
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => value.toLocaleString()
      }
    }
  };

  const series = [
    {
      name: 'Applications',
      data: data.map(item => item.totalApplications)
    },
    {
      name: 'Offers Issued',
      data: data.map(item => item.offersIssued)
    },
    {
      name: 'COE Issued',
      data: data.map(item => item.coeIssued)
    },
    {
      name: 'Collection ($)',
      data: data.map(item => item.totalCollection)
    }
  ];

  if (loading) {
    return (
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="BarChart3" size={20} />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {showPeriodToggle && (
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <Button
                variant={period === 'monthly' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('monthly')}
                className="rounded-none border-none"
              >
                Monthly
              </Button>
              <Button
                variant={period === 'weekly' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod('weekly')}
                className="rounded-none border-none border-l border-gray-300"
              >
                Weekly
              </Button>
            </div>
          )}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <Button
              variant={chartTypeLocal === 'line' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setChartTypeLocal('line')}
              className="rounded-none border-none"
              icon="TrendingUp"
            />
            <Button
              variant={chartTypeLocal === 'bar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setChartTypeLocal('bar')}
              className="rounded-none border-none border-l border-gray-300"
              icon="BarChart3"
            />
          </div>
        </div>
      </div>
      
      <Chart
        options={chartOptions}
        series={series}
        type={chartTypeLocal}
        height={350}
      />
    </motion.div>
  );
};

export default ChartContainer;