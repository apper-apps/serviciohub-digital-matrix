import mockTeam from '../mockData/team.json';

let teamData = [...mockTeam];
let nextId = Math.max(...teamData.map(user => user.Id)) + 1;

const teamService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...teamData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID debe ser un número entero válido');
    }
    
    const user = teamData.find(user => user.Id === id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return { ...user };
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.role) {
      throw new Error('Nombre, email y rol son requeridos');
    }
    
    // Check if email already exists
    const existingUser = teamData.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está en uso');
    }
    
    // Validate role
    const validRoles = ['Superadmin', 'Admin', 'Colaborator'];
    if (!validRoles.includes(userData.role)) {
      throw new Error('Rol no válido');
    }
    
    const newUser = {
      Id: nextId++,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      status: userData.status || 'Activo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    teamData.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID debe ser un número entero válido');
    }
    
    const userIndex = teamData.findIndex(user => user.Id === id);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Check if email is being changed and already exists
    if (userData.email && userData.email !== teamData[userIndex].email) {
      const existingUser = teamData.find(user => user.email === userData.email && user.Id !== id);
      if (existingUser) {
        throw new Error('El email ya está en uso');
      }
    }
    
    // Validate role if provided
    if (userData.role) {
      const validRoles = ['Superadmin', 'Admin', 'Colaborator'];
      if (!validRoles.includes(userData.role)) {
        throw new Error('Rol no válido');
      }
    }
    
    const updatedUser = {
      ...teamData[userIndex],
      ...userData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    teamData[userIndex] = updatedUser;
    return { ...updatedUser };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID debe ser un número entero válido');
    }
    
    const userIndex = teamData.findIndex(user => user.Id === id);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Prevent deletion of last Superadmin
    const user = teamData[userIndex];
    if (user.role === 'Superadmin') {
      const superadminCount = teamData.filter(u => u.role === 'Superadmin').length;
      if (superadminCount <= 1) {
        throw new Error('No se puede eliminar el último Superadmin');
      }
    }
    
    teamData.splice(userIndex, 1);
    return { success: true };
  },

  async getRoles() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      { value: 'Superadmin', label: 'Superadmin' },
      { value: 'Admin', label: 'Admin' },
      { value: 'Colaborator', label: 'Colaborator' }
    ];
  }
};

export default teamService;