const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const agentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "active" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('agent', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const agentId = parseInt(id);
      if (isNaN(agentId)) {
        throw new Error('Invalid agent ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "active" } }
        ]
      };
      
      const response = await apperClient.getRecordById('agent', agentId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching agent with ID ${id}:`, error);
      throw error;
    }
  },

  async create(agentData) {
    try {
      const params = {
        records: [{
          Name: agentData.name || agentData.Name,
          email: agentData.email,
          phone: agentData.phone,
          active: agentData.active !== undefined ? agentData.active : true
        }]
      };
      
      const response = await apperClient.createRecord('agent', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create agent');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      throw error;
    }
  },

  async update(id, agentData) {
    try {
      const agentId = parseInt(id);
      if (isNaN(agentId)) {
        throw new Error('Invalid agent ID');
      }
      
      const params = {
        records: [{
          Id: agentId,
          Name: agentData.name || agentData.Name,
          email: agentData.email,
          phone: agentData.phone,
          active: agentData.active
        }]
      };
      
      const response = await apperClient.updateRecord('agent', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update agent');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const agentId = parseInt(id);
      if (isNaN(agentId)) {
        throw new Error('Invalid agent ID');
      }
      
      const params = {
        RecordIds: [agentId]
      };
      
      const response = await apperClient.deleteRecord('agent', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete agent');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      throw error;
    }
  }
};

export default agentService;