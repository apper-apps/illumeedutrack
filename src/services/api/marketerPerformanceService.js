const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const marketerPerformanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "marketer" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "totalOffers" } },
          { field: { Name: "totalCoes" } },
          { field: { Name: "totalCollections" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('marketer_performance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching marketer performance:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const performanceId = parseInt(id);
      if (isNaN(performanceId)) {
        throw new Error('Invalid marketer performance ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "marketer" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "totalOffers" } },
          { field: { Name: "totalCoes" } },
          { field: { Name: "totalCollections" } }
        ]
      };
      
      const response = await apperClient.getRecordById('marketer_performance', performanceId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching marketer performance with ID ${id}:`, error);
      throw error;
    }
  },

  async create(performanceData) {
    try {
      const params = {
        records: [{
          Name: performanceData.Name || performanceData.name,
          marketer: parseInt(performanceData.marketer),
          totalOffers: performanceData.totalOffers || 0,
          totalCoes: performanceData.totalCoes || 0,
          totalCollections: performanceData.totalCollections || 0
        }]
      };
      
      const response = await apperClient.createRecord('marketer_performance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create marketer performance');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating marketer performance:", error);
      throw error;
    }
  },

  async update(id, performanceData) {
    try {
      const performanceId = parseInt(id);
      if (isNaN(performanceId)) {
        throw new Error('Invalid marketer performance ID');
      }
      
      const params = {
        records: [{
          Id: performanceId,
          Name: performanceData.Name || performanceData.name,
          marketer: parseInt(performanceData.marketer),
          totalOffers: performanceData.totalOffers,
          totalCoes: performanceData.totalCoes,
          totalCollections: performanceData.totalCollections
        }]
      };
      
      const response = await apperClient.updateRecord('marketer_performance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update marketer performance');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating marketer performance:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const performanceId = parseInt(id);
      if (isNaN(performanceId)) {
        throw new Error('Invalid marketer performance ID');
      }
      
      const params = {
        RecordIds: [performanceId]
      };
      
      const response = await apperClient.deleteRecord('marketer_performance', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete marketer performance');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting marketer performance:", error);
      throw error;
    }
  }
};

export default marketerPerformanceService;