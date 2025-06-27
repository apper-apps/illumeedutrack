import studentsData from '../mockData/students.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let students = [...studentsData];

const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id, 10));
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    const updatedStudent = {
      ...students[index],
      ...studentData,
      Id: students[index].Id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    students[index] = updatedStudent;
    return { ...updatedStudent };
  },

  async delete(id) {
    await delay(250);
    const index = students.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Student not found');
    }
    students.splice(index, 1);
    return true;
  },

  async getFilteredData(filters) {
    await delay(300);
    let filtered = [...students];

    if (filters.campus) {
      filtered = filtered.filter(s => s.campus === filters.campus);
    }
    if (filters.course) {
      filtered = filtered.filter(s => s.course === filters.course);
    }
    if (filters.agent) {
      filtered = filtered.filter(s => s.agentName === filters.agent);
    }
    if (filters.intake) {
      filtered = filtered.filter(s => s.intake === filters.intake);
    }
    if (filters.location) {
      filtered = filtered.filter(s => s.location === filters.location);
    }
    if (filters.offerStatus) {
      filtered = filtered.filter(s => s.offerStatus === filters.offerStatus);
    }
if (filters.gsStatus) {
      filtered = filtered.filter(s => s.gsStatus === filters.gsStatus);
    }
    if (filters.coeStatus) {
      filtered = filtered.filter(s => s.coeStatus === filters.coeStatus);
    }
    if (filters.visaStatus) {
      filtered = filtered.filter(s => s.visaStatus === filters.visaStatus);
    }
    if (filters.marketer) {
      filtered = filtered.filter(s => s.marketerName === filters.marketer);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.agentName.toLowerCase().includes(searchTerm) ||
        s.marketerName.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }
};

export default studentService;