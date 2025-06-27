import mockUser from '../mockData/user.json';

let userData = { ...mockUser };

const userService = {
  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...userData };
  },

  async updateProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    userData = {
      ...userData,
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...userData };
  },

  async changePassword(currentPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (currentPassword !== 'admin123') {
      throw new Error('Contraseña actual incorrecta');
    }
    
    return { success: true };
  },

  async validateEmail(email) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

export default userService;