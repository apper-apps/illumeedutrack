import analyticsData from '../mockData/analyticsData.json';
import studentService from './studentService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyticsService = {
  async getMonthlyData() {
    await delay(400);
    return [...analyticsData];
  },

  async getWeeklyData() {
    await delay(350);
    // Generate weekly data based on monthly data
    const weeklyData = [];
    analyticsData.forEach(monthData => {
      const weeksInMonth = 4;
      for (let week = 1; week <= weeksInMonth; week++) {
        weeklyData.push({
          period: `${monthData.period}-W${week}`,
          totalApplications: Math.floor(monthData.totalApplications / weeksInMonth) + (week === 1 ? monthData.totalApplications % weeksInMonth : 0),
          offersIssued: Math.floor(monthData.offersIssued / weeksInMonth) + (week === 1 ? monthData.offersIssued % weeksInMonth : 0),
          coeIssued: Math.floor(monthData.coeIssued / weeksInMonth) + (week === 1 ? monthData.coeIssued % weeksInMonth : 0),
          totalCollection: Math.floor(monthData.totalCollection / weeksInMonth) + (week === 1 ? monthData.totalCollection % weeksInMonth : 0)
        });
      }
    });
    return weeklyData;
  },

  async getDashboardStats() {
    await delay(300);
    const students = await studentService.getAll();
    
    const totalApplications = students.length;
    const offersIssued = students.filter(s => s.offerStatus === 'Issued').length;
    const coeIssued = students.filter(s => s.coeStatus === 'Issued').length;
    const totalCollection = students
      .filter(s => s.offerStatus === 'Issued')
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      totalApplications,
      offersIssued,
      coeIssued,
      totalCollection
    };
  },

  async getAgentPerformance() {
    await delay(350);
    const students = await studentService.getAll();
    const agentStats = {};

    students.forEach(student => {
      const agentName = student.agentName;
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
      if (student.offerStatus === 'Issued') {
        agentStats[agentName].offersIssued++;
        agentStats[agentName].totalAmount += student.amount;
      }
      if (student.coeStatus === 'Issued') {
        agentStats[agentName].coeIssued++;
      }
    });

    return Object.values(agentStats).map(stats => ({
      ...stats,
      conversionRate: stats.applications > 0 ? (stats.offersIssued / stats.applications * 100).toFixed(1) : '0.0'
    }));
  },

  async getMarketerPerformance() {
    await delay(350);
    const students = await studentService.getAll();
    const marketerStats = {};

    students.forEach(student => {
      const marketerName = student.marketerName;
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
      if (student.offerStatus === 'Issued') {
        marketerStats[marketerName].offersIssued++;
        marketerStats[marketerName].totalAmount += student.amount;
      }
      if (student.coeStatus === 'Issued') {
        marketerStats[marketerName].coeIssued++;
      }
    });

    return Object.values(marketerStats).map(stats => ({
      ...stats,
      conversionRate: stats.applications > 0 ? (stats.offersIssued / stats.applications * 100).toFixed(1) : '0.0'
    }));
  }
};

export default analyticsService;