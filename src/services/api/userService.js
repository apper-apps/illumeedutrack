const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const userService = {
  async getAllUsers() {
    try {
      // Since we don't have a specific users table, we'll simulate user management
      // In a real implementation, this would fetch from a users table
      const mockUsers = [
        {
          Id: 1,
          Name: 'John Admin',
          email: 'john@example.com',
          role: 'Admin',
          active: true,
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20'
        },
        {
          Id: 2,
          Name: 'Sarah Manager',
          email: 'sarah@example.com',
          role: 'Manager',
          active: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19'
        }
      ];
      
      return mockUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      // Simulate user creation with validation
      if (!userData.Name || !userData.email || !userData.role) {
        throw new Error('Name, email, and role are required');
      }

      // In a real implementation, this would create a user record
      const newUser = {
        Id: Date.now(), // Temporary ID generation
        Name: userData.Name,
        email: userData.email,
        role: userData.role,
        active: userData.active !== undefined ? userData.active : true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        password: userData.password // In real implementation, this would be hashed
      };

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      // In a real implementation, this would update the user record
      const updatedUser = {
        Id: userId,
        Name: userData.Name,
        email: userData.email,
        role: userData.role,
        active: userData.active
      };

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      // In a real implementation, this would delete the user record
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async resetPassword(userId, newPassword) {
    try {
      const id = parseInt(userId);
      if (isNaN(id)) {
        throw new Error('Invalid user ID');
      }

      // In a real implementation, this would update the user's password
      // The password should be hashed before storing
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  async generateLoginCredentials(userData) {
    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 
                          Math.random().toString(36).slice(-8).toUpperCase();
      
      // In a real implementation, this would:
      // 1. Create the user account in the authentication system
      // 2. Send login credentials via email
      // 3. Set temporary password that must be changed on first login
      
      return {
        email: userData.email,
        temporaryPassword: tempPassword,
        loginUrl: window.location.origin + '/login',
        mustChangePassword: true
      };
    } catch (error) {
      console.error("Error generating login credentials:", error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      const id = parseInt(userId);
      if (isNaN(id)) {
        throw new Error('Invalid user ID');
      }

      // In a real implementation, this would update user profile information
      const updatedProfile = {
        Id: id,
        Name: profileData.Name,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        position: profileData.position,
        avatar: profileData.avatar
      };

      return updatedProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
};

export default userService;