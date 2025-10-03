// src/services/apimock.js

const mockBlueprints = [
  {
    author: "Julian",
    name: "Casa1",
    points: [{ x: 10, y: 20 }, { x: 50, y: 80 }]
  },
  {
    author: "Juan",
    name: "Edificio",
    points: [{ x: 40, y: 50 }, { x: 100, y: 120 }]
  },
  {
    author: "Nicole",
    name: "Apartamento",
    points: [{ x: 60, y: 80 }, { x: 80, y: 100 }]
  }
];

export const apimock = {
  getAll: async () => {
    return Promise.resolve(mockBlueprints);
  },

  getByAuthor: async (author) => {
    return Promise.resolve(mockBlueprints.filter(bp => bp.author === author));
  },

  getByAuthorAndName: async (author, name) => {
    return Promise.resolve(
      mockBlueprints.find(bp => bp.author === author && bp.name === name)
    );
  },

  create: async (blueprint) => {
    mockBlueprints.push(blueprint);
    return Promise.resolve(blueprint);
  },

  update: async (author, name, payload) => {
    const idx = mockBlueprints.findIndex(bp => bp.author === author && bp.name === name);
    if (idx === -1) return Promise.reject(new Error('Blueprint not found'));
    mockBlueprints[idx] = { ...mockBlueprints[idx], ...payload };
    return Promise.resolve(mockBlueprints[idx]);
  },
  remove: async (author, name) => {
    const idx = mockBlueprints.findIndex(bp => bp.author === author && bp.name === name);
    if (idx === -1) return Promise.reject(new Error('Blueprint not found'));
    const [removed] = mockBlueprints.splice(idx, 1);
    return Promise.resolve(removed);
  }
};
