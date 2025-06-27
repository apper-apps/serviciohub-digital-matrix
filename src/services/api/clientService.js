const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const clientService = {
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
          { field: { Name: "company_name" } },
          { field: { Name: "rfc" } },
          { field: { Name: "contacts" } },
          { field: { Name: "services" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('client', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        companyName: record.company_name || record.Name,
        rfc: record.rfc || '',
        contacts: typeof record.contacts === 'string' ? JSON.parse(record.contacts || '[]') : (record.contacts || []),
        services: typeof record.services === 'string' ? record.services.split(',').filter(s => s) : (record.services || []),
        status: record.status || 'active',
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString()
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Error al cargar clientes');
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
          { field: { Name: "company_name" } },
          { field: { Name: "rfc" } },
          { field: { Name: "contacts" } },
          { field: { Name: "services" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.getRecordById('client', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Cliente no encontrado');
      }

      // Transform database record to match UI expectations
      const record = response.data;
      return {
        Id: record.Id,
        companyName: record.company_name || record.Name,
        rfc: record.rfc || '',
        contacts: typeof record.contacts === 'string' ? JSON.parse(record.contacts || '[]') : (record.contacts || []),
        services: typeof record.services === 'string' ? record.services.split(',').filter(s => s) : (record.services || []),
        status: record.status || 'active',
        createdAt: record.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching client:', error);
      throw new Error('Cliente no encontrado');
    }
  },

  async create(clientData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: clientData.companyName || clientData.Name,
        company_name: clientData.companyName,
        rfc: clientData.rfc,
        contacts: typeof clientData.contacts === 'object' ? JSON.stringify(clientData.contacts) : clientData.contacts,
        services: Array.isArray(clientData.services) ? clientData.services.join(',') : clientData.services,
        status: clientData.status || 'active',
        created_at: new Date().toISOString()
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('client', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error creating client');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            companyName: record.company_name || record.Name,
            rfc: record.rfc || '',
            contacts: typeof record.contacts === 'string' ? JSON.parse(record.contacts || '[]') : (record.contacts || []),
            services: typeof record.services === 'string' ? record.services.split(',').filter(s => s) : (record.services || []),
            status: record.status || 'active',
            createdAt: record.created_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Error al crear cliente');
    }
  },

  async update(id, clientData) {
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
        Name: clientData.companyName || clientData.Name,
        company_name: clientData.companyName,
        rfc: clientData.rfc,
        contacts: typeof clientData.contacts === 'object' ? JSON.stringify(clientData.contacts) : clientData.contacts,
        services: Array.isArray(clientData.services) ? clientData.services.join(',') : clientData.services,
        status: clientData.status
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('client', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating client');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            companyName: record.company_name || record.Name,
            rfc: record.rfc || '',
            contacts: typeof record.contacts === 'string' ? JSON.parse(record.contacts || '[]') : (record.contacts || []),
            services: typeof record.services === 'string' ? record.services.split(',').filter(s => s) : (record.services || []),
            status: record.status || 'active',
            createdAt: record.created_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating client:', error);
      throw new Error('Error al actualizar cliente');
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

      const response = await apperClient.deleteRecord('client', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Error deleting client');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw new Error('Error al eliminar cliente');
    }
  }
};

export default clientService;