import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/usuarios/login', { email, password });
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        const user = await authService.getProfile();
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      }
      
      throw new Error('Token nao recebido');
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/usuarios/my-profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
