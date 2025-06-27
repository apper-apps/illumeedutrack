import studentService from "@/services/api/studentService";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const analyticsService = {
async getMonthlyData() {
    try {
      const params = {
        fields: [
          { field: { Name: "period" } },
          { field: { Name: "total_applications" } },
          { field: { Name: "offers_issued" } },
          { field: { Name: "coe_issued" } },
          { field: { Name: "total_collection" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('analytics_data', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching monthly analytics data:", error);
      throw error;
    }
  },

  async getWeeklyData() {
    try {
      const monthlyData = await this.getMonthlyData();
      const weeklyData = [];
      
      monthlyData.forEach(monthData => {
        const weeksInMonth = 4;
        for (let week = 1; week <= weeksInMonth; week++) {
          weeklyData.push({
            period: `${monthData.period}-W${week}`,
            totalApplications: Math.floor(monthData.total_applications / weeksInMonth) + 
              (week === 1 ? monthData.total_applications % weeksInMonth : 0),
            offersIssued: Math.floor(monthData.offers_issued / weeksInMonth) + 
              (week === 1 ? monthData.offers_issued % weeksInMonth : 0),
            coeIssued: Math.floor(monthData.coe_issued / weeksInMonth) + 
              (week === 1 ? monthData.coe_issued % weeksInMonth : 0),
            totalCollection: Math.floor(monthData.total_collection / weeksInMonth) + 
              (week === 1 ? monthData.total_collection % weeksInMonth : 0)
          });
        }
      });
      
      return weeklyData;
    } catch (error) {
      console.error("Error generating weekly analytics data:", error);
      throw error;
    }
  },

  async getDashboardStats() {
    try {
      const students = await studentService.getAll();
      
      const totalApplications = students.length;
      const offersIssued = students.filter(s => s.offer_status === 'Issued').length;
      const coeIssued = students.filter(s => s.coe_status === 'Issued').length;
      const totalCollection = students
        .filter(s => s.offer_status === 'Issued')
        .reduce((sum, s) => sum + (s.amount || 0), 0);

      return {
        totalApplications,
        offersIssued,
        coeIssued,
        totalCollection
      };
    } catch (error) {
      console.error("Error calculating dashboard stats:", error);
      throw error;
    }
  },

  async getAgentPerformance() {
    try {
      const students = await studentService.getAll();
      const agentStats = {};

      students.forEach(student => {
        const agentName = student.agent_name?.Name || student.agent_name || 'Unknown Agent';
        if (!agentStats[agentName]) {
          agentStats[agentName] = {
            agent: agentName,
            applications: 0,
            offersIssued: 0,
            coeIssued: 0,
            totalAmount: 0
          };
        }

        agentStats[agentName].applications++;
        if (student.offer_status === 'Issued') {
          agentStats[agentName].offersIssued++;
          agentStats[agentName].totalAmount += (student.amount || 0);
        }
        if (student.coe_status === 'Issued') {
          agentStats[agentName].coeIssued++;
        }
      });

      return Object.values(agentStats).map(stats => ({
        ...stats,
        conversionRate: stats.applications > 0 ? (stats.offersIssued / stats.applications * 100).toFixed(1) : '0.0'
      }));
    } catch (error) {
      console.error("Error calculating agent performance:", error);
      throw error;
    }
  },

  async getMarketerPerformance() {
    try {
      const students = await studentService.getAll();
      const marketerStats = {};

      students.forEach(student => {
        const marketerName = student.marketer_name?.Name || student.marketer_name || 'Unknown Marketer';
        if (!marketerStats[marketerName]) {
          marketerStats[marketerName] = {
            marketer: marketerName,
            applications: 0,
            offersIssued: 0,
            coeIssued: 0,
            totalAmount: 0
          };
        }

        marketerStats[marketerName].applications++;
        if (student.offer_status === 'Issued') {
          marketerStats[marketerName].offersIssued++;
          marketerStats[marketerName].totalAmount += (student.amount || 0);
        }
        if (student.coe_status === 'Issued') {
          marketerStats[marketerName].coeIssued++;
        }
      });

      return Object.values(marketerStats).map(stats => ({
        ...stats,
        conversionRate: stats.applications > 0 ? (stats.offersIssued / stats.applications * 100).toFixed(1) : '0.0'
      }));
    } catch (error) {
      console.error("Error calculating marketer performance:", error);
      throw error;
    }
  },

  async getMarketerPerformanceByFilters(filters = {}) {
    try {
      const filteredStudents = await studentService.getFilteredData(filters);
      const marketerStats = {};

      filteredStudents.forEach(student => {
        const marketerName = student.marketer_name?.Name || student.marketer_name || 'Unknown Marketer';
        if (!marketerStats[marketerName]) {
          marketerStats[marketerName] = {
            marketer: marketerName,
            applications: 0,
            offersIssued: 0,
            coeIssued: 0,
            totalAmount: 0,
            campus: filters.campus || 'All',
            course: filters.course || 'All',
            intake: filters.intake || 'All'
          };
        }

        marketerStats[marketerName].applications++;
        if (student.offer_status === 'Issued') {
          marketerStats[marketerName].offersIssued++;
          marketerStats[marketerName].totalAmount += (student.amount || 0);
        }
        if (student.coe_status === 'Issued') {
          marketerStats[marketerName].coeIssued++;
        }
      });

      return Object.values(marketerStats).map(stats => ({
        ...stats,
        conversionRate: stats.applications > 0 ? (stats.offersIssued / stats.applications * 100).toFixed(1) : '0.0'
      }));
    } catch (error) {
      console.error("Error calculating filtered marketer performance:", error);
      throw error;
    }
  }
};

export default analyticsService;