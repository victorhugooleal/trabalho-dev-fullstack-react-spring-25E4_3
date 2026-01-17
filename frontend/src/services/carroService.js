import api from './api';

export const carroService = {
  getAll: async (page = 0, size = 10) => {
    try {
      const response = await api.get('/carros', {
        headers: {
          page: page.toString(),
          size: size.toString(),
        },
      });
      const totalCount = response.headers['x-total-count'];
      return {
        carros: response.data,
        totalCount: totalCount ? parseInt(totalCount) : response.data.length,
      };
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/carros/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (carro) => {
    try {
      const response = await api.post('/carros', carro);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, carro) => {
    try {
      const response = await api.put(`/carros/${id}`, carro);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/carros/${id}`);
    } catch (error) {
      throw error;
    }
  },

  search: async (modelo, fabricante, pais) => {
    try {
      const headers = {};
      if (modelo) headers.modelo = modelo;
      if (fabricante) headers.fabricante = fabricante;
      if (pais) headers.pais = pais;

      const response = await api.get('/carros/search', { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportCSV: async () => {
    try {
      const response = await api.get('/carros/export-cars', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'carros.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      throw error;
    }
  },
};
