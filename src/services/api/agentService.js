import agentsData from '../mockData/agents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let agents = [...agentsData];

const agentService = {
  async getAll() {
    await delay(250);
    return [...agents];
  },

  async getById(id) {
    await delay(200);
    const agent = agents.find(a => a.Id === parseInt(id, 10));
    if (!agent) {
      throw new Error('Agent not found');
    }
    return { ...agent };
  },

  async create(agentData) {
    await delay(300);
    const maxId = agents.length > 0 ? Math.max(...agents.map(a => a.Id)) : 0;
    const newAgent = {
      ...agentData,
      Id: maxId + 1,
      active: true
    };
    agents.push(newAgent);
    return { ...newAgent };
  },

  async update(id, agentData) {
    await delay(250);
    const index = agents.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    const updatedAgent = {
      ...agents[index],
      ...agentData,
      Id: agents[index].Id // Preserve ID
    };
    agents[index] = updatedAgent;
    return { ...updatedAgent };
  },

  async delete(id) {
    await delay(200);
    const index = agents.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Agent not found');
    }
    agents.splice(index, 1);
    return true;
  }
};

export default agentService;