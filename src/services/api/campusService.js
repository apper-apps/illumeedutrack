const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const campusService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('campus', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching campuses:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const campusId = parseInt(id);
      if (isNaN(campusId)) {
        throw new Error('Invalid campus ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "location" } }
        ]
      };
      
      const response = await apperClient.getRecordById('campus', campusId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching campus with ID ${id}:`, error);
      throw error;
    }
  },

  async create(campusData) {
    try {
      const params = {
        records: [{
          Name: campusData.name || campusData.Name,
          location: campusData.location
        }]
      };
      
      const response = await apperClient.createRecord('campus', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create campus');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating campus:", error);
      throw error;
    }
  },

  async update(id, campusData) {
    try {
      const campusId = parseInt(id);
      if (isNaN(campusId)) {
        throw new Error('Invalid campus ID');
      }
      
      const params = {
        records: [{
          Id: campusId,
          Name: campusData.name || campusData.Name,
          location: campusData.location
        }]
      };
      
      const response = await apperClient.updateRecord('campus', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update campus');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating campus:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const campusId = parseInt(id);
      if (isNaN(campusId)) {
        throw new Error('Invalid campus ID');
      }
      
      const params = {
        RecordIds: [campusId]
      };
      
      const response = await apperClient.deleteRecord('campus', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete campus');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting campus:", error);
      throw error;
    }
  }
};

export default campusService;