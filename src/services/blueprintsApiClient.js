
import api from './apiClient.js'

export const blueprintsApiClient = {
  getAll: async () => {
    const { data } = await api.get('/blueprints');
    return data;
  },

  getByAuthor: async (author) => {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`);
    return data;
  },

  getByAuthorAndName: async (author, name) => {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`
    );
    return data;
  },

  create: async (blueprint) => {
    const { data } = await api.post('/blueprints', blueprint);
    return data;
  },

  update: async (author, name, payload) => {
    const { data } = await api.put(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`, payload);
    return data;
  },

  // --- REMOVE (DELETE) ---
  remove: async (author, name) => {
    const { data } = await api.delete(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`);
    return data;
  }
};

export default blueprintsApiClient;
