const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const marketerService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "active" } },
          { field: { Name: "specialization" } },
          { field: { Name: "performance" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('marketer', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching marketers:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const marketerId = parseInt(id);
      if (isNaN(marketerId)) {
        throw new Error('Invalid marketer ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "active" } },
          { field: { Name: "specialization" } },
          { field: { Name: "performance" } }
        ]
      };
      
      const response = await apperClient.getRecordById('marketer', marketerId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching marketer with ID ${id}:`, error);
      throw error;
    }
  },

  async create(marketerData) {
    try {
      const params = {
        records: [{
          Name: marketerData.name || marketerData.Name,
          email: marketerData.email,
          phone: marketerData.phone,
          company: marketerData.company,
          active: marketerData.active !== undefined ? marketerData.active : true,
          specialization: marketerData.specialization || 'General Marketing',
          performance: marketerData.performance || 'Good'
        }]
      };
      
      const response = await apperClient.createRecord('marketer', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create marketer');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating marketer:", error);
      throw error;
    }
  },

  async update(id, marketerData) {
    try {
      const marketerId = parseInt(id);
      if (isNaN(marketerId)) {
        throw new Error('Invalid marketer ID');
      }
      
      const params = {
        records: [{
          Id: marketerId,
          Name: marketerData.name || marketerData.Name,
          email: marketerData.email,
          phone: marketerData.phone,
          company: marketerData.company,
          active: marketerData.active,
          specialization: marketerData.specialization,
          performance: marketerData.performance
        }]
      };
      
      const response = await apperClient.updateRecord('marketer', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update marketer');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating marketer:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const marketerId = parseInt(id);
      if (isNaN(marketerId)) {
        throw new Error('Invalid marketer ID');
      }
      
      const params = {
        RecordIds: [marketerId]
      };
      
      const response = await apperClient.deleteRecord('marketer', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete marketer');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting marketer:", error);
      throw error;
    }
  }
};

export default marketerService;