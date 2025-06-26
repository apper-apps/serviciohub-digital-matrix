import servicesData from '../mockData/services.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let services = [...servicesData];

const serviceService = {
  async getAll() {
    await delay(300);
    return [...services];
  },

  async getById(id) {
    await delay(200);
    const service = services.find(s => s.Id === parseInt(id, 10));
    if (!service) {
      throw new Error('Servicio no encontrado');
    }
    return { ...service };
  },

  async create(serviceData) {
    await delay(400);
    const newService = {
      ...serviceData,
      Id: Math.max(...services.map(s => s.Id), 0) + 1
    };
    services.push(newService);
    return { ...newService };
  },

  async update(id, serviceData) {
    await delay(350);
    const index = services.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }
    const updatedService = { ...services[index], ...serviceData };
    services[index] = updatedService;
    return { ...updatedService };
  },

  async delete(id) {
    await delay(250);
    const index = services.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }
    services.splice(index, 1);
    return true;
  }
};

export default serviceService;