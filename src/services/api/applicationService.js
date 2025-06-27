const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const applicationService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "campus" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "agent" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "marketer" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "offerStatus" } },
          { field: { Name: "gsStatus" } },
          { field: { Name: "visaStatus" } },
          { field: { Name: "coeStatus" } },
          { field: { Name: "remarks" } },
          { field: { Name: "amount" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('application', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const applicationId = parseInt(id);
      if (isNaN(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "student" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "campus" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "agent" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "marketer" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "offerStatus" } },
          { field: { Name: "gsStatus" } },
          { field: { Name: "visaStatus" } },
          { field: { Name: "coeStatus" } },
          { field: { Name: "remarks" } },
          { field: { Name: "amount" } }
        ]
      };
      
      const response = await apperClient.getRecordById('application', applicationId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching application with ID ${id}:`, error);
      throw error;
    }
  },

  async create(applicationData) {
    try {
      const params = {
        records: [{
          Name: applicationData.Name || applicationData.name,
          student: parseInt(applicationData.student),
          campus: parseInt(applicationData.campus),
          agent: parseInt(applicationData.agent),
          marketer: parseInt(applicationData.marketer),
          offerStatus: applicationData.offerStatus,
          gsStatus: applicationData.gsStatus,
          visaStatus: applicationData.visaStatus,
          coeStatus: applicationData.coeStatus,
          remarks: applicationData.remarks,
          amount: applicationData.amount
        }]
      };
      
      const response = await apperClient.createRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create application');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  },

  async update(id, applicationData) {
    try {
      const applicationId = parseInt(id);
      if (isNaN(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const params = {
        records: [{
          Id: applicationId,
          Name: applicationData.Name || applicationData.name,
          student: parseInt(applicationData.student),
          campus: parseInt(applicationData.campus),
          agent: parseInt(applicationData.agent),
          marketer: parseInt(applicationData.marketer),
          offerStatus: applicationData.offerStatus,
          gsStatus: applicationData.gsStatus,
          visaStatus: applicationData.visaStatus,
          coeStatus: applicationData.coeStatus,
          remarks: applicationData.remarks,
          amount: applicationData.amount
        }]
      };
      
      const response = await apperClient.updateRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update application');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const applicationId = parseInt(id);
      if (isNaN(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const params = {
        RecordIds: [applicationId]
      };
      
      const response = await apperClient.deleteRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete application');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  }
};

export default applicationService;