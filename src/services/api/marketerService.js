import mockData from '../mockData/marketers.json';

let marketers = [...mockData];
let nextId = Math.max(...marketers.map(m => m.Id)) + 1;

const marketerService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...marketers];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const marketerId = parseInt(id);
    if (isNaN(marketerId)) {
      throw new Error('Invalid marketer ID');
    }
    const marketer = marketers.find(m => m.Id === marketerId);
    if (!marketer) {
      throw new Error('Marketer not found');
    }
    return { ...marketer };
  },

  async create(marketerData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!marketerData.name || !marketerData.email || !marketerData.phone || !marketerData.company) {
      throw new Error('Missing required fields');
    }

    const newMarketer = {
      ...marketerData,
      Id: nextId++,
      active: marketerData.active ?? true,
      specialization: marketerData.specialization || 'General Marketing',
      performance: marketerData.performance || 'Good'
    };

    marketers.push(newMarketer);
    return { ...newMarketer };
  },

  async update(id, marketerData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const marketerId = parseInt(id);
    if (isNaN(marketerId)) {
      throw new Error('Invalid marketer ID');
    }

    const index = marketers.findIndex(m => m.Id === marketerId);
    if (index === -1) {
      throw new Error('Marketer not found');
    }

    if (!marketerData.name || !marketerData.email || !marketerData.phone || !marketerData.company) {
      throw new Error('Missing required fields');
    }

    marketers[index] = {
      ...marketers[index],
      ...marketerData,
      Id: marketerId // Ensure ID is not overwritten
    };

    return { ...marketers[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const marketerId = parseInt(id);
    if (isNaN(marketerId)) {
      throw new Error('Invalid marketer ID');
    }

    const index = marketers.findIndex(m => m.Id === marketerId);
    if (index === -1) {
      throw new Error('Marketer not found');
    }

    const deletedMarketer = marketers[index];
    marketers.splice(index, 1);
    return { ...deletedMarketer };
  }
};

export default marketerService;