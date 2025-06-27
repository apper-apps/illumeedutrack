import campusesData from '../mockData/campuses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let campuses = [...campusesData];

const campusService = {
  async getAll() {
    await delay(200);
    return [...campuses];
  },

  async getById(id) {
    await delay(150);
    const campus = campuses.find(c => c.Id === parseInt(id, 10));
    if (!campus) {
      throw new Error('Campus not found');
    }
    return { ...campus };
  },

  async create(campusData) {
    await delay(250);
    const maxId = campuses.length > 0 ? Math.max(...campuses.map(c => c.Id)) : 0;
    const newCampus = {
      ...campusData,
      Id: maxId + 1
    };
    campuses.push(newCampus);
    return { ...newCampus };
  },

  async update(id, campusData) {
    await delay(200);
    const index = campuses.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campus not found');
    }
    
    const updatedCampus = {
      ...campuses[index],
      ...campusData,
      Id: campuses[index].Id // Preserve ID
    };
    campuses[index] = updatedCampus;
    return { ...updatedCampus };
  },

  async delete(id) {
    await delay(180);
    const index = campuses.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Campus not found');
    }
    campuses.splice(index, 1);
    return true;
  }
};

export default campusService;