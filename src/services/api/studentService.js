const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course" } },
          { field: { Name: "intake" } },
          { field: { Name: "location" } },
          { field: { Name: "offer_status" } },
          { field: { Name: "gs_status" } },
          { field: { Name: "visa_status" } },
          { field: { Name: "amount" } },
          { field: { Name: "coe_status" } },
          { field: { Name: "remarks" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "campus" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "agent_name" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "marketer_name" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const studentId = parseInt(id);
      if (isNaN(studentId)) {
        throw new Error('Invalid student ID');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course" } },
          { field: { Name: "intake" } },
          { field: { Name: "location" } },
          { field: { Name: "offer_status" } },
          { field: { Name: "gs_status" } },
          { field: { Name: "visa_status" } },
          { field: { Name: "amount" } },
          { field: { Name: "coe_status" } },
          { field: { Name: "remarks" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "campus" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "agent_name" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "marketer_name" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('student', studentId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name || studentData.name,
          course: studentData.course,
          intake: studentData.intake,
          location: studentData.location,
          offer_status: studentData.offer_status || studentData.offerStatus,
          gs_status: studentData.gs_status || studentData.gsStatus,
          visa_status: studentData.visa_status || studentData.visaStatus,
          amount: studentData.amount,
          coe_status: studentData.coe_status || studentData.coeStatus,
          remarks: studentData.remarks,
          campus: parseInt(studentData.campus),
          agent_name: parseInt(studentData.agent_name || studentData.agentId),
          marketer_name: parseInt(studentData.marketer_name || studentData.marketerId)
        }]
      };
      
      const response = await apperClient.createRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create student');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const studentId = parseInt(id);
      if (isNaN(studentId)) {
        throw new Error('Invalid student ID');
      }
      
      const params = {
        records: [{
          Id: studentId,
          Name: studentData.Name || studentData.name,
          course: studentData.course,
          intake: studentData.intake,
          location: studentData.location,
          offer_status: studentData.offer_status || studentData.offerStatus,
          gs_status: studentData.gs_status || studentData.gsStatus,
          visa_status: studentData.visa_status || studentData.visaStatus,
          amount: studentData.amount,
          coe_status: studentData.coe_status || studentData.coeStatus,
          remarks: studentData.remarks,
          campus: parseInt(studentData.campus),
          agent_name: parseInt(studentData.agent_name || studentData.agentId),
          marketer_name: parseInt(studentData.marketer_name || studentData.marketerId)
        }]
      };
      
      const response = await apperClient.updateRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update student');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const studentId = parseInt(id);
      if (isNaN(studentId)) {
        throw new Error('Invalid student ID');
      }
      
      const params = {
        RecordIds: [studentId]
      };
      
      const response = await apperClient.deleteRecord('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete student');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  async getFilteredData(filters) {
    try {
      const whereConditions = [];
      
      if (filters.campus) {
        whereConditions.push({
          FieldName: "campus",
          Operator: "EqualTo",
          Values: [filters.campus]
        });
      }
      
      if (filters.course) {
        whereConditions.push({
          FieldName: "course",
          Operator: "EqualTo",
          Values: [filters.course]
        });
      }
      
      if (filters.intake) {
        whereConditions.push({
          FieldName: "intake",
          Operator: "EqualTo",
          Values: [filters.intake]
        });
      }
      
      if (filters.location) {
        whereConditions.push({
          FieldName: "location",
          Operator: "EqualTo",
          Values: [filters.location]
        });
      }
      
      if (filters.offerStatus) {
        whereConditions.push({
          FieldName: "offer_status",
          Operator: "EqualTo",
          Values: [filters.offerStatus]
        });
      }
      
      if (filters.gsStatus) {
        whereConditions.push({
          FieldName: "gs_status",
          Operator: "EqualTo",
          Values: [filters.gsStatus]
        });
      }
      
      if (filters.coeStatus) {
        whereConditions.push({
          FieldName: "coe_status",
          Operator: "EqualTo",
          Values: [filters.coeStatus]
        });
      }
      
      if (filters.visaStatus) {
        whereConditions.push({
          FieldName: "visa_status",
          Operator: "EqualTo",
          Values: [filters.visaStatus]
        });
      }
      
      if (filters.search) {
        whereConditions.push({
          FieldName: "Name",
          Operator: "Contains",
          Values: [filters.search]
        });
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course" } },
          { field: { Name: "intake" } },
          { field: { Name: "location" } },
          { field: { Name: "offer_status" } },
          { field: { Name: "gs_status" } },
          { field: { Name: "visa_status" } },
          { field: { Name: "amount" } },
          { field: { Name: "coe_status" } },
          { field: { Name: "remarks" } },
          { 
            field: { name: "campus" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "agent_name" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "marketer_name" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords('student', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error filtering students:", error);
      throw error;
    }
  }
};

export default studentService;