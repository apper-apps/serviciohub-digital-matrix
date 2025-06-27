const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const quotesService = {
  // Get all quotes
  async getAll() {
    try {
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "client_name" } },
          { field: { Name: "quote_number" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "valid_until" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "notes" } },
          { field: { Name: "client_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        clientId: record.client_id,
        clientName: record.client_name,
        quoteNumber: record.quote_number,
        title: record.title,
        description: record.description,
        items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
        subtotal: record.subtotal || 0,
        tax: record.tax || 0,
        total: record.total || 0,
        status: record.status || 'Pendiente',
        validUntil: record.valid_until,
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString(),
        updatedAt: record.updated_at || record.ModifiedOn || new Date().toISOString(),
        notes: record.notes || ''
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Error al cargar cotizaciones');
    }
  },

  // Get quote by ID
  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID must be a positive integer');
      }
      
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "client_name" } },
          { field: { Name: "quote_number" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "valid_until" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "notes" } },
          { field: { Name: "client_id" } }
        ]
      };

      const response = await apperClient.getRecordById('quote', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Quote with ID ${id} not found`);
      }

      const record = response.data;
      return {
        Id: record.Id,
        clientId: record.client_id,
        clientName: record.client_name,
        quoteNumber: record.quote_number,
        title: record.title,
        description: record.description,
        items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
        subtotal: record.subtotal || 0,
        tax: record.tax || 0,
        total: record.total || 0,
        status: record.status || 'Pendiente',
        validUntil: record.valid_until,
        createdAt: record.created_at || new Date().toISOString(),
        updatedAt: record.updated_at || new Date().toISOString(),
        notes: record.notes || ''
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error(`Quote with ID ${id} not found`);
    }
  },

  // Create new quote
  async create(quoteData) {
    try {
      await delay();
      
      // Calculate totals
      const subtotal = quoteData.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
      const tax = subtotal * 0.16; // 16% tax
      const total = subtotal + tax;
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: quoteData.title,
        client_name: quoteData.clientName,
        quote_number: `COT-2024-${String(Date.now()).slice(-3)}`,
        title: quoteData.title,
        description: quoteData.description || '',
        items: typeof quoteData.items === 'object' ? JSON.stringify(quoteData.items) : quoteData.items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'Pendiente',
        valid_until: quoteData.validUntil,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: quoteData.notes || '',
        client_id: quoteData.clientId
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error creating quote');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id,
            clientName: record.client_name,
            quoteNumber: record.quote_number,
            title: record.title,
            description: record.description,
            items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
            subtotal: record.subtotal || 0,
            tax: record.tax || 0,
            total: record.total || 0,
            status: record.status || 'Pendiente',
            validUntil: record.valid_until,
            createdAt: record.created_at || new Date().toISOString(),
            updatedAt: record.updated_at || new Date().toISOString(),
            notes: record.notes || ''
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating quote:', error);
      throw new Error('Error al crear cotización');
    }
  },

  // Update existing quote
  async update(id, updateData) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID must be a positive integer');
      }
      
      await delay();
      
      // Recalculate totals if items changed
      let subtotal = updateData.subtotal;
      let tax = updateData.tax;
      let total = updateData.total;
      
      if (updateData.items) {
        subtotal = updateData.items.reduce((sum, item) => sum + (item.total || 0), 0);
        tax = subtotal * 0.16;
        total = subtotal + tax;
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Id: id,
        Name: updateData.title,
        client_name: updateData.clientName,
        title: updateData.title,
        description: updateData.description,
        items: typeof updateData.items === 'object' ? JSON.stringify(updateData.items) : updateData.items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: updateData.status,
        valid_until: updateData.validUntil,
        updated_at: new Date().toISOString(),
        notes: updateData.notes,
        client_id: updateData.clientId
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating quote');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id,
            clientName: record.client_name,
            quoteNumber: record.quote_number,
            title: record.title,
            description: record.description,
            items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
            subtotal: record.subtotal || 0,
            tax: record.tax || 0,
            total: record.total || 0,
            status: record.status || 'Pendiente',
            validUntil: record.valid_until,
            createdAt: record.created_at || new Date().toISOString(),
            updatedAt: record.updated_at || new Date().toISOString(),
            notes: record.notes || ''
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating quote:', error);
      throw new Error(`Quote with ID ${id} not found`);
    }
  },

  // Delete quote
  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID must be a positive integer');
      }
      
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Error deleting quote');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw new Error(`Quote with ID ${id} not found`);
    }
  },

  // Update quote status
  async updateStatus(id, status) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID must be a positive integer');
      }
      
      if (!['Pendiente', 'Aprobada', 'Rechazada'].includes(status)) {
        throw new Error('Invalid status. Must be: Pendiente, Aprobada, or Rechazada');
      }
      
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const transformedData = {
        Id: id,
        status: status,
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating quote status');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id,
            clientName: record.client_name,
            quoteNumber: record.quote_number,
            title: record.title,
            description: record.description,
            items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
            subtotal: record.subtotal || 0,
            tax: record.tax || 0,
            total: record.total || 0,
            status: record.status || 'Pendiente',
            validUntil: record.valid_until,
            createdAt: record.created_at || new Date().toISOString(),
            updatedAt: record.updated_at || new Date().toISOString(),
            notes: record.notes || ''
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw new Error(`Quote with ID ${id} not found`);
    }
  },

  // Get quotes by client ID
  async getByClientId(clientId) {
    try {
      if (!Number.isInteger(clientId) || clientId <= 0) {
        throw new Error('Client ID must be a positive integer');
      }
      
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "client_name" } },
          { field: { Name: "quote_number" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "valid_until" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "notes" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "client_id",
            Operator: "EqualTo",
            Values: [clientId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        clientId: record.client_id,
        clientName: record.client_name,
        quoteNumber: record.quote_number,
        title: record.title,
        description: record.description,
        items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
        subtotal: record.subtotal || 0,
        tax: record.tax || 0,
        total: record.total || 0,
        status: record.status || 'Pendiente',
        validUntil: record.valid_until,
        createdAt: record.created_at || new Date().toISOString(),
        updatedAt: record.updated_at || new Date().toISOString(),
        notes: record.notes || ''
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching quotes by client:', error);
      throw new Error('Error al cargar cotizaciones del cliente');
    }
  },

  // Get quotes by status
  async getByStatus(status) {
    try {
      if (!['Pendiente', 'Aprobada', 'Rechazada'].includes(status)) {
        throw new Error('Invalid status. Must be: Pendiente, Aprobada, or Rechazada');
      }
      
      await delay();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "client_name" } },
          { field: { Name: "quote_number" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "items" } },
          { field: { Name: "subtotal" } },
          { field: { Name: "tax" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "valid_until" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "notes" } },
          { field: { Name: "client_id" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('quote', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        clientId: record.client_id,
        clientName: record.client_name,
        quoteNumber: record.quote_number,
        title: record.title,
        description: record.description,
        items: typeof record.items === 'string' ? JSON.parse(record.items || '[]') : (record.items || []),
        subtotal: record.subtotal || 0,
        tax: record.tax || 0,
        total: record.total || 0,
        status: record.status || 'Pendiente',
        validUntil: record.valid_until,
        createdAt: record.created_at || new Date().toISOString(),
        updatedAt: record.updated_at || new Date().toISOString(),
        notes: record.notes || ''
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching quotes by status:', error);
      throw new Error('Error al cargar cotizaciones por estado');
    }
  }
};

export default quotesService;