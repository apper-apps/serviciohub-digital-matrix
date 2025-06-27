const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ticketService = {
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
          { field: { Name: "subject" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "messages" } },
          { field: { Name: "client_id" } },
          { field: { Name: "service_id" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('ticket', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        clientId: record.client_id ? record.client_id.toString() : '',
        serviceId: record.service_id ? record.service_id.toString() : '',
        subject: record.subject,
        priority: record.priority,
        status: record.status,
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString(),
        messages: typeof record.messages === 'string' ? JSON.parse(record.messages || '[]') : (record.messages || [])
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Error al cargar tickets');
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
          { field: { Name: "subject" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "messages" } },
          { field: { Name: "client_id" } },
          { field: { Name: "service_id" } }
        ]
      };

      const response = await apperClient.getRecordById('ticket', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Ticket no encontrado');
      }

      const record = response.data;
      return {
        Id: record.Id,
        clientId: record.client_id ? record.client_id.toString() : '',
        serviceId: record.service_id ? record.service_id.toString() : '',
        subject: record.subject,
        priority: record.priority,
        status: record.status,
        createdAt: record.created_at || new Date().toISOString(),
        messages: typeof record.messages === 'string' ? JSON.parse(record.messages || '[]') : (record.messages || [])
      };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw new Error('Ticket no encontrado');
    }
  },

  async create(ticketData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: ticketData.subject,
        subject: ticketData.subject,
        priority: ticketData.priority || 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
        messages: JSON.stringify([]),
        client_id: ticketData.clientId ? parseInt(ticketData.clientId, 10) : null,
        service_id: ticketData.serviceId ? parseInt(ticketData.serviceId, 10) : null
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('ticket', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error creating ticket');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id ? record.client_id.toString() : '',
            serviceId: record.service_id ? record.service_id.toString() : '',
            subject: record.subject,
            priority: record.priority,
            status: record.status,
            createdAt: record.created_at || new Date().toISOString(),
            messages: typeof record.messages === 'string' ? JSON.parse(record.messages || '[]') : (record.messages || [])
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Error al crear ticket');
    }
  },

  async update(id, ticketData) {
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
        Name: ticketData.subject,
        subject: ticketData.subject,
        priority: ticketData.priority,
        status: ticketData.status,
        messages: typeof ticketData.messages === 'object' ? JSON.stringify(ticketData.messages) : ticketData.messages,
        client_id: ticketData.clientId ? parseInt(ticketData.clientId, 10) : null,
        service_id: ticketData.serviceId ? parseInt(ticketData.serviceId, 10) : null
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('ticket', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Error updating ticket');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            clientId: record.client_id ? record.client_id.toString() : '',
            serviceId: record.service_id ? record.service_id.toString() : '',
            subject: record.subject,
            priority: record.priority,
            status: record.status,
            createdAt: record.created_at || new Date().toISOString(),
            messages: typeof record.messages === 'string' ? JSON.parse(record.messages || '[]') : (record.messages || [])
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error('Ticket no encontrado');
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

      const response = await apperClient.deleteRecord('ticket', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Error deleting ticket');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw new Error('Ticket no encontrado');
    }
  },

  async addMessage(ticketId, message) {
    try {
      await delay(200);
      
      // First get the current ticket
      const ticket = await this.getById(ticketId);
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      // Add new message to existing messages
      const newMessage = {
        id: Math.max(...(ticket.messages?.map(m => m.id) || [0]), 0) + 1,
        content: message.content,
        sender: message.sender,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...(ticket.messages || []), newMessage];

      // Update the ticket with new messages
      return await this.update(ticketId, {
        ...ticket,
        messages: updatedMessages
      });
    } catch (error) {
      console.error('Error adding message to ticket:', error);
      throw new Error('Error al agregar mensaje al ticket');
    }
  }
};

export default ticketService;