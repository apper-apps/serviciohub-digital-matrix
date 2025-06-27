const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const notificationService = {
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
          { field: { Name: "message" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "client_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('app_Notification', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        clientId: record.client_id,
        message: record.message,
        type: record.type,
        status: record.status,
        timestamp: record.timestamp || record.CreatedOn || new Date().toISOString()
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Error al cargar notificaciones');
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
          { field: { Name: "message" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "client_id" } }
        ]
      };

      const response = await apperClient.getRecordById('app_Notification', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Notificación no encontrada');
      }

      const record = response.data;
      return {
        Id: record.Id,
        clientId: record.client_id,
        message: record.message,
        type: record.type,
        status: record.status,
        timestamp: record.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Notificación no encontrada');
    }
  },

  async create(notificationData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: notificationData.message.substring(0, 50) + '...',
        message: notificationData.message,
        type: notificationData.type || 'individual',
        status: notificationData.status || 'sent',
        timestamp: notificationData.timestamp || new Date().toISOString(),
        client_id: notificationData.clientId ? parseInt(notificationData.clientId, 10) : null
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('app_Notification', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error creating notification');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id,
            message: record.message,
            type: record.type,
            status: record.status,
            timestamp: record.timestamp || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Error al crear notificación');
    }
  },

  async update(id, notificationData) {
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
        Name: notificationData.message ? notificationData.message.substring(0, 50) + '...' : undefined,
        message: notificationData.message,
        type: notificationData.type,
        status: notificationData.status,
        timestamp: notificationData.timestamp,
        client_id: notificationData.clientId ? parseInt(notificationData.clientId, 10) : null
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('app_Notification', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating notification');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id,
            message: record.message,
            type: record.type,
            status: record.status,
            timestamp: record.timestamp || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new Error('Notificación no encontrada');
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

      const response = await apperClient.deleteRecord('app_Notification', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Error deleting notification');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Notificación no encontrada');
    }
  }
};

export default notificationService;