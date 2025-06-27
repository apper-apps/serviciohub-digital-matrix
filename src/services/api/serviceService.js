const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const serviceService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "price" } },
          { field: { Name: "billing_cycle" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('service', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        name: record.Name,
        category: record.category,
        price: record.price || 0,
        billingCycle: record.billing_cycle,
        description: record.description
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Error al cargar servicios');
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "price" } },
          { field: { Name: "billing_cycle" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('service', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Servicio no encontrado');
      }

      const record = response.data;
      return {
        Id: record.Id,
        name: record.Name,
        category: record.category,
        price: record.price || 0,
        billingCycle: record.billing_cycle,
        description: record.description
      };
    } catch (error) {
      console.error('Error fetching service:', error);
      throw new Error('Servicio no encontrado');
    }
  },

  async create(serviceData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: serviceData.name,
        category: serviceData.category,
        price: serviceData.price || 0,
        billing_cycle: serviceData.billingCycle,
        description: serviceData.description
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error creating service');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            name: record.Name,
            category: record.category,
            price: record.price || 0,
            billingCycle: record.billing_cycle,
            description: record.description
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error('Error al crear servicio');
    }
  },

  async update(id, serviceData) {
    try {
      await delay(350);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Id: parseInt(id, 10),
        Name: serviceData.name,
        category: serviceData.category,
        price: serviceData.price || 0,
        billing_cycle: serviceData.billingCycle,
        description: serviceData.description
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating service');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            name: record.Name,
            category: record.category,
            price: record.price || 0,
            billingCycle: record.billing_cycle,
            description: record.description
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error('Servicio no encontrado');
    }
  },

  async delete(id) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('service', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Error deleting service');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw new Error('Servicio no encontrado');
    }
  }
};

export default serviceService;