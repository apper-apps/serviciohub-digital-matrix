const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const teamService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords('team', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database records to match UI expectations
      const transformedData = (response.data || []).map(record => ({
        Id: record.Id,
        name: record.Name,
        email: record.email,
        phone: record.phone || '',
        role: record.role,
        status: record.status,
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString(),
        updatedAt: record.updated_at || record.ModifiedOn || new Date().toISOString()
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Error al cargar miembros del equipo');
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID debe ser un número entero válido');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await apperClient.getRecordById('team', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Usuario no encontrado');
      }

      const record = response.data;
      return {
        Id: record.Id,
        name: record.Name,
        email: record.email,
        phone: record.phone || '',
        role: record.role,
        status: record.status,
        createdAt: record.created_at || new Date().toISOString(),
        updatedAt: record.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw new Error('Usuario no encontrado');
    }
  },

  async create(userData) {
    try {
      await delay(400);
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.role) {
        throw new Error('Nombre, email y rol son requeridos');
      }
      
      // Validate role
      const validRoles = ['Superadmin', 'Admin', 'Colaborator'];
      if (!validRoles.includes(userData.role)) {
        throw new Error('Rol no válido');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        status: userData.status || 'Activo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.createRecord('team', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          // Check for duplicate email error
          const emailError = failedRecords.find(record => 
            record.message && record.message.toLowerCase().includes('email')
          );
          if (emailError) {
            throw new Error('El email ya está en uso');
          }
          
          throw new Error(failedRecords[0].message || 'Error creating team member');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            name: record.Name,
            email: record.email,
            phone: record.phone || '',
            role: record.role,
            status: record.status,
            createdAt: record.created_at || new Date().toISOString(),
            updatedAt: record.updated_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating team member:', error);
      throw new Error(error.message || 'Error al crear usuario');
    }
  },

  async update(id, userData) {
    try {
      await delay(500);
      
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID debe ser un número entero válido');
      }
      
      // Validate role if provided
      if (userData.role) {
        const validRoles = ['Superadmin', 'Admin', 'Colaborator'];
        if (!validRoles.includes(userData.role)) {
          throw new Error('Rol no válido');
        }
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format with only Updateable fields
      const transformedData = {
        Id: id,
        Name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        status: userData.status,
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [transformedData]
      };

      const response = await apperClient.updateRecord('team', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          // Check for duplicate email error
          const emailError = failedRecords.find(record => 
            record.message && record.message.toLowerCase().includes('email')
          );
          if (emailError) {
            throw new Error('El email ya está en uso');
          }
          
          throw new Error(failedRecords[0].message || 'Error updating team member');
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data;
          return {
            Id: record.Id,
            name: record.Name,
            email: record.email,
            phone: record.phone || '',
            role: record.role,
            status: record.status,
            createdAt: record.created_at || new Date().toISOString(),
            updatedAt: record.updated_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating team member:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID debe ser un número entero válido');
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('team', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          // Check for superadmin protection error
          const superadminError = failedDeletions.find(record => 
            record.message && record.message.toLowerCase().includes('superadmin')
          );
          if (superadminError) {
            throw new Error('No se puede eliminar el último Superadmin');
          }
          
          throw new Error(failedDeletions[0].message || 'Error deleting team member');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  },

  async getRoles() {
    await delay(100);
    return [
      { value: 'Superadmin', label: 'Superadmin' },
      { value: 'Admin', label: 'Admin' },
      { value: 'Colaborator', label: 'Colaborator' }
    ];
  }
};

export default teamService;